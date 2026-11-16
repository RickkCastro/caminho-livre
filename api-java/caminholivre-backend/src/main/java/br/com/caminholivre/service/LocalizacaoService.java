package br.com.caminholivre.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.repository.LocalizacaoRepository;

@Service
public class LocalizacaoService {

    private final LocalizacaoRepository localizacoes;

    public LocalizacaoService(LocalizacaoRepository localizacoes) {
        this.localizacoes = localizacoes;
    }

    public List<Localizacao> listar() {
        return localizacoes.findAll();
    }

    public Localizacao buscar(Long id) {
        return localizacoes.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Localização " + id + " não encontrada"));
    }

    public Localizacao criar(Localizacao l) {
        l.setId(null);
        return localizacoes.save(l);
    }

    public Localizacao atualizar(Long id, Localizacao l) {
        buscar(id);
        l.setId(id);
        return localizacoes.save(l);
    }

    /** Localização usada por ocorrência ou trecho vira 409 (FK) no GlobalExceptionHandler. */
    public void excluir(Long id) {
        localizacoes.delete(buscar(id));
        localizacoes.flush();
    }
}
