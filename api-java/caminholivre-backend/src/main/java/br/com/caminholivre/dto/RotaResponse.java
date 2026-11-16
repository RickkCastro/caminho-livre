package br.com.caminholivre.dto;

import java.util.List;

/** caminhoLivre = null (com aviso) quando todo caminho passa por trecho bloqueado. */
public record RotaResponse(Trajeto comum, Trajeto caminhoLivre, String aviso) {

    public record Ponto(Double lat, Double lon) {
    }

    public record Trajeto(List<Ponto> pontos, double distanciaM) {
    }
}
