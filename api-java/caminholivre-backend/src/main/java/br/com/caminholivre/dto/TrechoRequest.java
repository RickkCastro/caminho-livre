package br.com.caminholivre.dto;

import jakarta.validation.constraints.*;

public record TrechoRequest(@NotNull Long idOrigem, @NotNull Long idDestino, @NotNull @Positive Double distanciaM,
        @Pattern(regexp = "[SN]") String iluminado) {
}
