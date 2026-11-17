package br.com.caminholivre.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

/** Swagger em /swagger-ui.html, com o botão Authorize para colar o ID token do Google. */
@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Caminho Livre API", version = "1.0", description = """
                API do Caminho Livre (FIAP GS 2026.2 — Domain Driven Design Java).

                **Login:** as rotas que alteram dados exigem `Authorization: Bearer <ID token do Google>`. Para obter \
                um token: entre no front com sua conta Google, abra o DevTools (F12) → Application → Local Storage → \
                chave `cl.sessao` e copie o campo `idToken`. Clique em **Authorize**, cole o token e confirme. \
                O token vale cerca de 1 hora. Nas rotas públicas (GET) ele é opcional.

                **⚠️ CRUD aberto para avaliação:** `/categorias`, `/localizacoes` e `/trechos` aceitam POST/PUT/DELETE \
                de qualquer usuário logado, de propósito, para testar os quatro verbos. Essas tabelas alimentam o mapa \
                e as rotas de todos; registros em uso respondem 409 sem apagar nada."""),
        security = @SecurityRequirement(name = "google"))
@SecurityScheme(name = "google", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT",
        description = "ID token do Google (campo idToken de cl.sessao no Local Storage do front)")
public class OpenApiConfig {
}
