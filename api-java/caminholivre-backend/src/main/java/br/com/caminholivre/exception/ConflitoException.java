package br.com.caminholivre.exception;

/** Respondida com HTTP 409 pelo GlobalExceptionHandler. */
public class ConflitoException extends RuntimeException {
    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
