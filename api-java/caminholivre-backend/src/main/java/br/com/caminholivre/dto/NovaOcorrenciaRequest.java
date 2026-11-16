package br.com.caminholivre.dto;

import jakarta.validation.constraints.*;

/** Corpo do POST /ocorrencias; o ponto do alerta vira uma Localizacao nova. */
public record NovaOcorrenciaRequest(
        @NotNull Long idCategoria,
        @NotNull @DecimalMin("-90") @DecimalMax("90") Double latitude,
        @NotNull @DecimalMin("-180") @DecimalMax("180") Double longitude,
        @Size(max = 150) String logradouro,
        @Size(max = 80) String bairro,
        @Size(max = 500) String descricao,
        @Size(max = 500) String fotoUrl) {
}
