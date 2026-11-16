package br.com.caminholivre.service;

import java.util.*;
import java.util.function.ToDoubleFunction;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import br.com.caminholivre.dto.RotaResponse;
import br.com.caminholivre.dto.RotaResponse.Ponto;
import br.com.caminholivre.dto.RotaResponse.Trajeto;
import br.com.caminholivre.dto.TrechoPeso;
import br.com.caminholivre.dto.TrechoPeso.Vertice;
import br.com.caminholivre.exception.RegraNegocioException;

@Service
public class RotaService {

    /** Ponto a mais de 500 m de qualquer vértice está fora da área mapeada. */
    static final double DISTANCIA_MAX_M = 500;

    private final TrechoService trechos;

    public RotaService(TrechoService trechos) {
        this.trechos = trechos;
    }

    public RotaResponse calcular(double origemLat, double origemLon, double destinoLat, double destinoLon,
            Integer hora, boolean mobilidadeReduzida, Set<Long> ignorar) {
        return montar(trechos.calcularPesos(hora, mobilidadeReduzida, ignorar),
                origemLat, origemLon, destinoLat, destinoLon);
    }

    /** Duas buscas no mesmo grafo: a comum só por distância; a Caminho Livre por peso e sem trechos bloqueados. */
    static RotaResponse montar(List<TrechoPeso> grafo, double oLat, double oLon, double dLat, double dLon) {
        Vertice origem = maisProximo(grafo, oLat, oLon, "origem");
        Vertice destino = maisProximo(grafo, dLat, dLon, "destino");

        Trajeto comum = dijkstra(grafo, origem, destino, TrechoPeso::distanciaM);
        if (comum == null) throw new RegraNegocioException("Não existe caminho entre a origem e o destino no mapa");
        Trajeto livre = dijkstra(grafo.stream().filter(t -> !t.bloqueado()).toList(), origem, destino,
                TrechoPeso::peso);
        String aviso = livre == null
                ? "Não há caminho sem obstáculos para mobilidade reduzida; mostramos só a rota comum."
                : null;
        return new RotaResponse(comum, livre, aviso);
    }

    private static Vertice maisProximo(List<TrechoPeso> grafo, double lat, double lon, String nome) {
        return grafo.stream().flatMap(t -> Stream.of(t.origem(), t.destino()))
                .min(Comparator.comparingDouble(v -> TrechoService.distanciaM(lat, lon, v.lat(), v.lon())))
                .filter(v -> TrechoService.distanciaM(lat, lon, v.lat(), v.lon()) <= DISTANCIA_MAX_M)
                .orElseThrow(() -> new RegraNegocioException(
                        "Ponto de " + nome + " fora da área mapeada (mais de 500 m de uma rua conhecida)"));
    }

    /** Dijkstra com PriorityQueue; trechos valem nos dois sentidos. null = destino inalcançável. */
    private static Trajeto dijkstra(List<TrechoPeso> arestas, Vertice origem, Vertice destino,
            ToDoubleFunction<TrechoPeso> custo) {
        Map<Long, List<TrechoPeso>> adj = new HashMap<>();
        Map<Long, Vertice> vertices = new HashMap<>(Map.of(origem.id(), origem));
        for (TrechoPeso t : arestas) {
            adj.computeIfAbsent(t.origem().id(), k -> new ArrayList<>()).add(t);
            adj.computeIfAbsent(t.destino().id(), k -> new ArrayList<>()).add(t);
            vertices.put(t.origem().id(), t.origem());
            vertices.put(t.destino().id(), t.destino());
        }

        Map<Long, Double> custoAte = new HashMap<>(Map.of(origem.id(), 0.0));
        Map<Long, TrechoPeso> veioPor = new HashMap<>();
        PriorityQueue<Map.Entry<Long, Double>> fila = new PriorityQueue<>(Map.Entry.comparingByValue());
        fila.add(Map.entry(origem.id(), 0.0));
        while (!fila.isEmpty()) {
            var atual = fila.poll();
            Long v = atual.getKey();
            if (atual.getValue() > custoAte.get(v)) continue;
            if (v.equals(destino.id())) break;
            for (TrechoPeso t : adj.getOrDefault(v, List.of())) {
                Long w = outraPonta(t, v);
                double novo = atual.getValue() + custo.applyAsDouble(t);
                if (novo < custoAte.getOrDefault(w, Double.MAX_VALUE)) {
                    custoAte.put(w, novo);
                    veioPor.put(w, t);
                    fila.add(Map.entry(w, novo));
                }
            }
        }
        if (!custoAte.containsKey(destino.id())) return null;

        LinkedList<Ponto> pontos = new LinkedList<>();
        double distancia = 0;
        Long v = destino.id();
        pontos.addFirst(ponto(vertices.get(v)));
        while (!v.equals(origem.id())) {
            TrechoPeso t = veioPor.get(v);
            distancia += t.distanciaM();
            v = outraPonta(t, v);
            pontos.addFirst(ponto(vertices.get(v)));
        }
        return new Trajeto(pontos, distancia);
    }

    private static Long outraPonta(TrechoPeso t, Long v) {
        return t.origem().id().equals(v) ? t.destino().id() : t.origem().id();
    }

    private static Ponto ponto(Vertice v) {
        return new Ponto(v.lat(), v.lon());
    }
}
