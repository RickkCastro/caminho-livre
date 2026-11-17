package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.LocalizacaoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * CRUD ABERTO DE PROPÓSITO, para a avaliação da disciplina: qualquer usuário logado com Google pode
 * criar, editar e apagar registros desta tabela de referência (não há perfil de administrador no escopo da GS).
 * Para restaurar os dados de demonstração, rode de novo database/scripts/01_create.sql e 02_insert.sql.
 */
@Tag(name = "Localizações", description = "⚠️ CRUD aberto para avaliação: qualquer usuário logado pode criar, editar e apagar. Afeta o mapa e as rotas de todos.")
@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {

    private final LocalizacaoService localizacoes;

    public LocalizacaoController(LocalizacaoService localizacoes) {
        this.localizacoes = localizacoes;
    }

    @GetMapping
    public List<Localizacao> listar() {
        return localizacoes.listar();
    }

    @GetMapping("/{id}")
    public Localizacao buscar(@PathVariable Long id) {
        return localizacoes.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Localizacao criar(@RequestBody @Valid Localizacao l,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return localizacoes.criar(l);
    }

    @PutMapping("/{id}")
    public Localizacao atualizar(@PathVariable Long id, @RequestBody @Valid Localizacao l,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return localizacoes.atualizar(id, l);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        localizacoes.excluir(id);
    }
}
