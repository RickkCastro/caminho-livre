package br.com.caminholivre.dto;

import br.com.caminholivre.model.Usuario;

/** Só nome, foto e pontos (LGPD: sem e-mail nem id). */
public record PessoaRanking(String nome, String fotoUrl, Integer pontos) {

    public static PessoaRanking de(Usuario u) {
        return new PessoaRanking(u.getNome(), u.getFotoUrl(), u.getPontos());
    }
}
