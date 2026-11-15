package br.com.caminholivre.dto;

import jakarta.validation.constraints.NotNull;

/** true = 👍 o problema continua; false = 👎 já foi resolvido. */
public record ConfirmacaoRequest(@NotNull Boolean confirma) {
}
