package br.com.caminholivre.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.caminholivre.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Lê "Authorization: Bearer <idToken Google>" e, se válido, guarda o usuário no atributo
 * {@value #USUARIO_LOGADO}. Não bloqueia nada: as rotas 🔒 chamam AuthService.exigir, que
 * responde 401 pelo GlobalExceptionHandler. Nos GETs públicos o token é opcional (preenche "minha").
 */
@Component
public class GoogleTokenFilter extends OncePerRequestFilter {

    public static final String USUARIO_LOGADO = "usuarioLogado";
    private static final Logger log = LoggerFactory.getLogger(GoogleTokenFilter.class);

    private final AuthService auth;

    public GoogleTokenFilter(AuthService auth) {
        this.auth = auth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ") && !request.getRequestURI().equals("/auth/google")) {
            try {
                auth.usuarioDoToken(header.substring(7)).ifPresent(u -> request.setAttribute(USUARIO_LOGADO, u));
            } catch (RuntimeException e) {
                // banco fora do ar: segue como visitante; a própria rota responde 503 ao usar o banco
                log.warn("Não foi possível identificar o usuário do token: {}", e.getMessage());
            }
        }
        chain.doFilter(request, response);
    }
}
