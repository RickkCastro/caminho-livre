package br.com.caminholivre.exception;

/** Respondida com HTTP 404 pelo GlobalExceptionHandler. */
public class RecursoNaoEncontradoException extends RuntimeException {
    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
