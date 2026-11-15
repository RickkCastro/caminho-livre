package br.com.caminholivre.dto;

import java.util.List;

/** pontuacao = soma do pesoBase das ocorrências ativas do bairro (menor = melhor). */
public record RankingBairros(List<Bairro> melhores, List<Bairro> piores) {

    public record Bairro(String bairro, double pontuacao, long totalAtivas) {
    }
}
