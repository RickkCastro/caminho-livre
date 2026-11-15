package br.com.caminholivre.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.caminholivre.dto.RotaFavoritaRequest;
import br.com.caminholivre.exception.AcessoNegadoException;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.RotaFavorita;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.RotaFavoritaRepository;

@Service
public class RotaFavoritaService {

    private final RotaFavoritaRepository favoritas;
    private final LocalizacaoService localizacoes;

    public RotaFavoritaService(RotaFavoritaRepository favoritas, LocalizacaoService localizacoes) {
        this.favoritas = favoritas;
        this.localizacoes = localizacoes;
    }

    public List<RotaFavorita> listar(Usuario logado) {
        return favoritas.findByIdUsuarioOrderByDtCriacaoDesc(logado.getId());
    }

    public RotaFavorita criar(Usuario logado, RotaFavoritaRequest r) {
        if (r.idOrigem().equals(r.idDestino()))
            throw new RegraNegocioException("Origem e destino da rota devem ser diferentes");
        RotaFavorita f = new RotaFavorita();
        f.setIdUsuario(logado.getId());
        f.setOrigem(localizacoes.buscar(r.idOrigem()));
        f.setDestino(localizacoes.buscar(r.idDestino()));
        f.setApelido(r.apelido().trim());
        return favoritas.save(f);
    }

    /** Só o dono apaga. */
    public void excluir(Long id, Usuario logado) {
        RotaFavorita f = favoritas.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Rota favorita " + id + " não encontrada"));
        if (!f.getIdUsuario().equals(logado.getId()))
            throw new AcessoNegadoException("Essa rota favorita é de outra pessoa");
        favoritas.delete(f);
    }
}
