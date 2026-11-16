package br.com.caminholivre.exception;

import java.time.LocalDateTime;

/** Formato único de erro da API: { timestamp, status, erro }. */
public record ErroResponse(LocalDateTime timestamp, int status, String erro) {
    public ErroResponse(int status, String erro) {
        this(LocalDateTime.now(), status, erro);
    }
}
