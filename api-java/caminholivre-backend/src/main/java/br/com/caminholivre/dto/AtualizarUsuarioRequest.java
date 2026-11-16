package br.com.caminholivre.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** PUT parcial: campo nulo fica como está. */
public record AtualizarUsuarioRequest(
        @Size(max = 100) @Pattern(regexp = ".*\\S.*", message = "não pode ficar em branco") String nome,
        @Size(max = 500) String fotoUrl,
        @Pattern(regexp = "[SN]") String mobilidadeReduzida) {
}
