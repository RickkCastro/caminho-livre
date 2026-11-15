package br.com.caminholivre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RotaFavoritaRequest(@NotNull Long idOrigem, @NotNull Long idDestino,
        @NotBlank @Size(max = 60) String apelido) {
}
