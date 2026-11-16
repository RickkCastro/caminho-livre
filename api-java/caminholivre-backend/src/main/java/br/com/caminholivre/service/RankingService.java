package br.com.caminholivre.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.PessoaRanking;
import br.com.caminholivre.dto.RankingBairros;
import br.com.caminholivre.dto.RankingBairros.Bairro;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.UsuarioRepository;

@Service
public class RankingService {

    static final int TOP = 5;

    private final OcorrenciaRepository ocorrencias;
    private final LocalizacaoRepository localizacoes;
    private final UsuarioRepository usuarios;

    public RankingService(OcorrenciaRepository ocorrencias, LocalizacaoRepository localizacoes,
            UsuarioRepository usuarios) {
        this.ocorrencias = ocorrencias;
        this.localizacoes = localizacoes;
        this.usuarios = usuarios;
    }

    /** Todos os usuários por pontos (desc); empate em ordem alfabética. */
    public List<PessoaRanking> usuarios() {
        return usuarios.findAllByOrderByPontosDescNomeAsc().stream().map(PessoaRanking::de).toList();
    }

    @Transactional
    public RankingBairros bairros() {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        var ativas = ocorrencias.listar(List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA), null, null);
        return montar(localizacoes.listarBairros(), ativas);
    }

    /**
     * Piores: só bairros com alerta, maior soma primeiro. Melhores: os de menor soma que não estão nos piores
     * (sem alerta contam 0), para o mesmo bairro não aparecer nas duas listas.
     */
    static RankingBairros montar(List<String> bairros, List<Ocorrencia> ativas) {
        List<Bairro> todos = bairros.stream().map(b -> {
            var doBairro = ativas.stream().filter(o -> b.equals(o.getLocalizacao().getBairro())).toList();
            double soma = doBairro.stream().mapToDouble(o -> o.getCategoria().getPesoBase()).sum();
            return new Bairro(b, soma, doBairro.size());
        }).toList();

        Comparator<Bairro> menorPrimeiro = Comparator.comparingDouble(Bairro::pontuacao).thenComparing(Bairro::bairro);
        var piores = todos.stream().filter(b -> b.totalAtivas() > 0)
                .sorted(Comparator.comparingDouble(Bairro::pontuacao).reversed().thenComparing(Bairro::bairro))
                .limit(TOP).toList();
        var melhores = todos.stream().filter(b -> !piores.contains(b)).sorted(menorPrimeiro).limit(TOP).toList();
        return new RankingBairros(melhores, piores);
    }
}
