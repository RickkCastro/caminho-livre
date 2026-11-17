package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.CategoriaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * CRUD ABERTO DE PROPÓSITO, para a avaliação da disciplina: qualquer usuário logado com Google pode
 * criar, editar e apagar registros desta tabela de referência (não há perfil de administrador no escopo da GS).
 * Para restaurar os dados de demonstração, rode de novo database/scripts/01_create.sql e 02_insert.sql.
 */
@Tag(name = "Categorias", description = "⚠️ CRUD aberto para avaliação: qualquer usuário logado pode criar, editar e apagar. Afeta o mapa e as rotas de todos.")
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
