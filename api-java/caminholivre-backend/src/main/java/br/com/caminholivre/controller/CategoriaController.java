package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.CategoriaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categorias;

    public CategoriaController(CategoriaService categorias) {
        this.categorias = categorias;
    }

    @GetMapping
    public List<CategoriaOcorrencia> listar() {
        return categorias.listar();
    }

    @GetMapping("/{id}")
    public CategoriaOcorrencia buscar(@PathVariable Long id) {
        return categorias.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaOcorrencia criar(@RequestBody @Valid CategoriaOcorrencia c,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return categorias.criar(c);
    }

    @PutMapping("/{id}")
    public CategoriaOcorrencia atualizar(@PathVariable Long id, @RequestBody @Valid CategoriaOcorrencia c,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return categorias.atualizar(id, c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        categorias.excluir(id);
    }
}
