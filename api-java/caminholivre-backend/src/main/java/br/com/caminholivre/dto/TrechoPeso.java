package br.com.caminholivre.dto;

/** Trecho com o custo do Caminho Livre; não traz dado de usuário (LGPD). */
public record TrechoPeso(Long idTrecho, Vertice origem, Vertice destino, Double distanciaM, double peso,
        boolean bloqueado) {

    public record Vertice(Long id, Double lat, Double lon) {
    }
}
