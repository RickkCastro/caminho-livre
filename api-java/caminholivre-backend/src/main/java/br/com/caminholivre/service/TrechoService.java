package br.com.caminholivre.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.TrechoPeso;
import br.com.caminholivre.dto.TrechoRequest;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.Trecho;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.TrechoRepository;

@Service
public class TrechoService {

    /** Alerta a até 30 m de uma ponta do trecho pesa nele. */
    static final double RAIO_M = 30;

    private final TrechoRepository trechos;
    private final OcorrenciaRepository ocorrencias;
    private final LocalizacaoService localizacoes;

    public TrechoService(TrechoRepository trechos, OcorrenciaRepository ocorrencias, LocalizacaoService localizacoes) {
        this.trechos = trechos;
        this.ocorrencias = ocorrencias;
        this.localizacoes = localizacoes;
    }

    public List<Trecho> listar() {
        return trechos.listarComPontos();
    }

    public Trecho buscar(Long id) {
        return trechos.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Trecho " + id + " não encontrado"));
    }

    /** Trecho repetido (mesma origem e destino) vira 409 pela UNIQUE do banco. */
    public Trecho criar(TrechoRequest r) {
        return trechos.save(preencher(new Trecho(), r));
    }

    public Trecho atualizar(Long id, TrechoRequest r) {
        return trechos.save(preencher(buscar(id), r));
    }

    public void excluir(Long id) {
        trechos.delete(buscar(id));
    }

    private Trecho preencher(Trecho t, TrechoRequest r) {
        if (r.idOrigem().equals(r.idDestino()))
            throw new RegraNegocioException("Origem e destino do trecho devem ser diferentes");
        t.setOrigem(localizacoes.buscar(r.idOrigem()));
        t.setDestino(localizacoes.buscar(r.idDestino()));
        t.setDistanciaM(r.distanciaM());
        t.setIluminado(r.iluminado() != null ? r.iluminado() : "S");
        return t;
    }

    /** hora nula = hora atual (o fuso padrão da JVM é America/Sao_Paulo). */
    @Transactional
    public List<TrechoPeso> calcularPesos(Integer hora, boolean mobilidadeReduzida, Set<Long> ignorar) {
        int h = hora != null ? hora : LocalTime.now().getHour();
        ocorrencias.expirarVencidas(LocalDateTime.now());
        var ativas = ocorrencias.listar(List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA), null, null);
        return pesar(trechos.listarComPontos(), ativas, h >= 19 || h < 6, mobilidadeReduzida,
                ignorar != null ? ignorar : Set.of());
    }

    /** peso = distância × (1 + Σ pesos dos alertas ativos a até 30 m de uma das pontas). */
    static List<TrechoPeso> pesar(List<Trecho> trechos, List<Ocorrencia> ativas, boolean noturno,
            boolean mobilidadeReduzida, Set<Long> ignorar) {
        var relevantes = ativas.stream()
                .filter(o -> o.getStatus().ativa() && !ignorar.contains(o.getCategoria().getId()))
                .toList();
        return trechos.stream().map(t -> {
            double soma = 0;
            boolean bloqueado = false;
            for (Ocorrencia o : relevantes) {
                if (!perto(o.getLocalizacao(), t.getOrigem()) && !perto(o.getLocalizacao(), t.getDestino())) continue;
                var c = o.getCategoria();
                soma += noturno ? c.getPesoNoturno() : c.getPesoBase();
                bloqueado |= mobilidadeReduzida && "S".equals(c.getBloqueiaMobilidade());
            }
            return new TrechoPeso(t.getId(), vertice(t.getOrigem()), vertice(t.getDestino()), t.getDistanciaM(),
                    t.getDistanciaM() * (1 + soma), bloqueado);
        }).toList();
    }

    private static boolean perto(Localizacao a, Localizacao b) {
        return distanciaM(a.getLatitude(), a.getLongitude(), b.getLatitude(), b.getLongitude()) <= RAIO_M;
    }

    private static TrechoPeso.Vertice vertice(Localizacao l) {
        return new TrechoPeso.Vertice(l.getId(), l.getLatitude(), l.getLongitude());
    }

    /** Haversine, em metros. */
    public static double distanciaM(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1), dLon = Math.toRadians(lon2 - lon1);
        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.pow(Math.sin(dLon / 2), 2);
        return 6_371_000 * 2 * Math.asin(Math.sqrt(a));
    }
}
