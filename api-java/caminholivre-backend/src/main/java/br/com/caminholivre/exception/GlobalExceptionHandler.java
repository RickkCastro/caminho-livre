package br.com.caminholivre.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/** Converte toda exceção em { timestamp, status, erro }, sem stack trace para o cliente. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(RecursoNaoEncontradoException e) {
        return erro(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> regraNegocio(RegraNegocioException e) {
        return erro(HttpStatus.UNPROCESSABLE_CONTENT, e.getMessage());
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroResponse> conflito(ConflitoException e) {
        return erro(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(NaoAutorizadoException.class)
    public ResponseEntity<ErroResponse> naoAutorizado(NaoAutorizadoException e) {
        return erro(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponse> acessoNegado(AcessoNegadoException e) {
        return erro(HttpStatus.FORBIDDEN, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream().findFirst()
                .map(f -> "Campo '" + f.getField() + "': " + f.getDefaultMessage())
                .orElse("Dados inválidos");
        return erro(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class, HandlerMethodValidationException.class})
    public ResponseEntity<ErroResponse> requisicaoInvalida(Exception e) {
        String msg = e instanceof MissingServletRequestParameterException m
                ? "Parâmetro '" + m.getParameterName() + "' é obrigatório"
                : "Requisição inválida: confira o JSON e os parâmetros";
        return erro(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> rotaInexistente(NoResourceFoundException e) {
        return erro(HttpStatus.NOT_FOUND, "Endereço não encontrado");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> integridade(DataIntegrityViolationException e) {
        log.warn("Violação de integridade: {}", e.getMostSpecificCause().getMessage());
        return erro(HttpStatus.CONFLICT, "Operação conflita com dados existentes (registro duplicado ou em uso)");
    }

    @ExceptionHandler({DataAccessResourceFailureException.class, CannotCreateTransactionException.class})
    public ResponseEntity<ErroResponse> bancoIndisponivel(Exception e) {
        log.error("Banco indisponível", e);
        return erro(HttpStatus.SERVICE_UNAVAILABLE, "Banco de dados indisponível. Tente de novo em instantes.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> inesperado(Exception e) {
        log.error("Erro inesperado", e);
        return erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno. Tente de novo.");
    }

    private ResponseEntity<ErroResponse> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(new ErroResponse(status.value(), mensagem));
    }
}
