package br.com.caminholivre.dto;

import br.com.caminholivre.model.Usuario;

/** O que qualquer pessoa logada pode ver de outra: sem e-mail (LGPD). */
public record UsuarioPublico(Long id, String nome, String fotoUrl, Integer pontos) {

    public static UsuarioPublico de(Usuario u) {
        return new UsuarioPublico(u.getId(), u.getNome(), u.getFotoUrl(), u.getPontos());
    }
}
