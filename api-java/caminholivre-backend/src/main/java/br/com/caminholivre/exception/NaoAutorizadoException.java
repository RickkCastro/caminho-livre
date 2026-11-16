package br.com.caminholivre.exception;

/** Respondida com HTTP 401 pelo GlobalExceptionHandler. */
public class NaoAutorizadoException extends RuntimeException {
    public NaoAutorizadoException(String mensagem) {
        super(mensagem);
    }
}
