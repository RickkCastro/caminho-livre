package br.com.caminholivre.dto;

import jakarta.validation.constraints.NotBlank;

/** ID token que o front recebe do Google Identity Services. */
public record LoginRequest(@NotBlank String idToken) {
}
