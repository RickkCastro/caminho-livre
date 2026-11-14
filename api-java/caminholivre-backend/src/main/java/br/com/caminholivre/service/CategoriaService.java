package br.com.caminholivre.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categorias;

    public CategoriaService(CategoriaRepository categorias) {
        this.categorias = categorias;
    }

    public List<CategoriaOcorrencia> listar() {
        return categorias.findAll();
    }

    public CategoriaOcorrencia buscar(Long id) {
        return categorias.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria " + id + " não encontrada"));
    }

    public CategoriaOcorrencia criar(CategoriaOcorrencia c) {
        c.setId(null);
        return categorias.save(c);
    }

    public CategoriaOcorrencia atualizar(Long id, CategoriaOcorrencia c) {
        buscar(id);
        c.setId(id);
        return categorias.save(c);
    }

    /** Categoria em uso por ocorrências vira 409 (FK) no GlobalExceptionHandler. */
    public void excluir(Long id) {
        categorias.delete(buscar(id));
        categorias.flush();
    }
}
