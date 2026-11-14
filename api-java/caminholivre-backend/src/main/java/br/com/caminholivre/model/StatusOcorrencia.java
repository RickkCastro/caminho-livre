package br.com.caminholivre.model;

public enum StatusOcorrencia {
    ABERTA, CONFIRMADA, EXPIRADA, RESOLVIDA;

    /** Só alertas ativos aparecem no mapa, pesam na rota e aceitam avaliação. */
    public boolean ativa() {
        return this == ABERTA || this == CONFIRMADA;
    }
}
