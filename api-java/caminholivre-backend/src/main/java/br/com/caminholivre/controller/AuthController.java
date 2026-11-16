package br.com.caminholivre.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.caminholivre.dto.LoginRequest;
import br.com.caminholivre.dto.UsuarioResponse;
import br.com.caminholivre.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    /** 201 quando cria a conta (primeiro acesso), 200 quando ela já existe. */
    @PostMapping("/google")
    public ResponseEntity<UsuarioResponse> entrar(@RequestBody @Valid LoginRequest r) {
        UsuarioResponse u = auth.entrar(r.idToken());
        return ResponseEntity.status(u.primeiroAcesso() ? HttpStatus.CREATED : HttpStatus.OK).body(u);
    }
}
