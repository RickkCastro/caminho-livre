package br.com.caminholivre.dto;

import br.com.caminholivre.model.StatusOcorrencia;

public record TotaisResponse(StatusOcorrencia status, long totalConfirma, long totalNega) {
}
