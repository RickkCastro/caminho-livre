package br.com.caminholivre.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.RankingBairros;
import br.com.caminholivre.dto.RankingBairros.Bairro;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;

@Service
public class RankingService {

    static final int TOP = 5;

    private final OcorrenciaRepository ocorrencias;
    private final LocalizacaoRepository localizacoes;

    public RankingService(OcorrenciaRepository ocorrencias, LocalizacaoRepository localizacoes) {
        this.ocorrencias = ocorrencias;
        this.localizacoes = localizacoes;
    }

    @Transactional
    public RankingBairros bairros() {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        var ativas = ocorrencias.listar(List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA), null, null);
        return montar(localizacoes.listarBairros(), ativas);
    }

    /** Bairro sem alerta ativo entra nos melhores com 0; nos piores só entra quem tem alerta. */
    static RankingBairros montar(List<String> bairros, List<Ocorrencia> ativas) {
        List<Bairro> todos = bairros.stream().map(b -> {
            var doBairro = ativas.stream().filter(o -> b.equals(o.getLocalizacao().getBairro())).toList();
            double soma = doBairro.stream().mapToDouble(o -> o.getCategoria().getPesoBase()).sum();
            return new Bairro(b, soma, doBairro.size());
        }).toList();

        Comparator<Bairro> menorPrimeiro = Comparator.comparingDouble(Bairro::pontuacao).thenComparing(Bairro::bairro);
        var melhores = todos.stream().sorted(menorPrimeiro).limit(TOP).toList();
        var piores = todos.stream().filter(b -> b.totalAtivas() > 0)
                .sorted(Comparator.comparingDouble(Bairro::pontuacao).reversed().thenComparing(Bairro::bairro))
                .limit(TOP).toList();
        return new RankingBairros(melhores, piores);
    }
}
