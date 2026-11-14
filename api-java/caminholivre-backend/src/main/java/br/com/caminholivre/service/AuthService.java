package br.com.caminholivre.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import br.com.caminholivre.exception.NaoAutorizadoException;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.UsuarioRepository;

/** Login só pelo Google: valida o ID token a cada chamada, sem senha nem JWT próprio. */
@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final GoogleIdTokenVerifier verificador;

    public AuthService(UsuarioRepository usuarios, @Value("${app.google-client-id}") String googleClientId) {
        this.usuarios = usuarios;
        this.verificador = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(List.of(googleClientId))
                .build();
    }

    public GoogleIdToken.Payload verificar(String idToken) {
        try {
            GoogleIdToken token = verificador.verify(idToken);
            if (token != null) return token.getPayload();
        } catch (Exception e) {
            // token malformado: tratado igual a token inválido
        }
        throw new NaoAutorizadoException("Login inválido ou expirado. Entre com o Google de novo.");
    }

    /** Usado pelo filtro: token inválido ou de quem nunca entrou = visitante. */
    public Optional<Usuario> usuarioDoToken(String idToken) {
        try {
            return usuarios.findByGoogleId(verificar(idToken).getSubject());
        } catch (NaoAutorizadoException e) {
            return Optional.empty();
        }
    }

    /** Rotas 🔒 chamam isto com o usuário que o GoogleTokenFilter identificou. */
    public static Usuario exigir(Usuario logado) {
        if (logado == null) throw new NaoAutorizadoException("Entre com sua conta Google para continuar.");
        return logado;
    }
}
