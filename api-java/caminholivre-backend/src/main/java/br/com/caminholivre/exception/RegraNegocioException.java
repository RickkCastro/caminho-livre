package br.com.caminholivre.exception;

/** Respondida com HTTP 422 pelo GlobalExceptionHandler. */
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
