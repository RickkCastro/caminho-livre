package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.RotaFavoritaRequest;
import br.com.caminholivre.model.RotaFavorita;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.RotaFavoritaService;
import jakarta.validation.Valid;

/** Rotas favoritas do usuário logado (o dono vem do token, não da URL). */
@RestController
@RequestMapping("/rotas-favoritas")
public class RotaFavoritaController {

    private final RotaFavoritaService favoritas;

    public RotaFavoritaController(RotaFavoritaService favoritas) {
        this.favoritas = favoritas;
    }

    @GetMapping
    public List<RotaFavorita> listar(
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return favoritas.listar(AuthService.exigir(logado));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RotaFavorita criar(@RequestBody @Valid RotaFavoritaRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return favoritas.criar(AuthService.exigir(logado), r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        favoritas.excluir(id, AuthService.exigir(logado));
    }
}
