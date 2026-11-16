package br.com.caminholivre.exception;

/** Respondida com HTTP 403 pelo GlobalExceptionHandler. */
public class AcessoNegadoException extends RuntimeException {
    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
