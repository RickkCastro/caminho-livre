package br.com.caminholivre.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** considerar: S = a rota desvia dessa categoria; N = ignora. */
public record PreferenciaDto(@NotNull Long idCategoria, @NotNull @Pattern(regexp = "[SN]") String considerar) {
}
