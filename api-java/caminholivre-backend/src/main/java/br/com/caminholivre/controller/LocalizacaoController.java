package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.LocalizacaoService;
import jakarta.validation.Valid;

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
