package br.com.caminholivre.dto;

import br.com.caminholivre.model.Usuario;

/** Usuário sem o googleId. primeiroAcesso só é true na criação da conta (o front abre o onboarding). */
public record UsuarioResponse(Long id, String nome, String email, String fotoUrl, String mobilidadeReduzida,
        Integer pontos, boolean primeiroAcesso) {

    public static UsuarioResponse de(Usuario u, boolean primeiroAcesso) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getFotoUrl(), u.getMobilidadeReduzida(),
                u.getPontos(), primeiroAcesso);
    }
}
