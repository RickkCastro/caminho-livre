package br.com.caminholivre.service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import br.com.caminholivre.dto.RotaResponse;
import br.com.caminholivre.dto.RotaResponse.Ponto;
import br.com.caminholivre.dto.RotaResponse.Trajeto;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.repository.OcorrenciaRepository;

/**
 * Rota por ruas reais (OpenRouteService, OpenStreetMap, Brasil inteiro). A comum vai a pé; a Caminho Livre
 * desvia de um quadrado em volta de cada alerta relevante e, com mobilidade reduzida, usa o perfil de
 * cadeira de rodas.
 */
@Service
public class RotaService {

    /** Alerta com peso a partir disso (na hora pedida) entra no desvio: Degrau 5, Buraco 3, Rua escura à noite 6. */
    static final double PESO_MIN_DESVIO = 3;
    /** Meio lado do quadrado evitado em volta do alerta. */
    static final double RAIO_DESVIO_M = 25;
    /** Alerta colado na origem ou no destino não entra: a rota não teria como começar ou terminar. */
    static final double FOLGA_PONTAS_M = 60;
    /** Só alertas perto do trajeto (caixa da origem e destino + margem) vão no pedido. */
    static final double MARGEM_M = 2000;

    private static final String AVISO_SEM_DESVIO =
            "Não há caminho que desvie de todos os problemas avisados; mostramos só a rota comum.";

    private final OcorrenciaRepository ocorrencias;
    private final RestClient ors;

    public RotaService(OcorrenciaRepository ocorrencias, @Value("${app.ors-api-key}") String chave) {
        this.ocorrencias = ocorrencias;
        var fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(Duration.ofSeconds(5));
        fabrica.setReadTimeout(Duration.ofSeconds(15));
        this.ors = RestClient.builder()
                .baseUrl("https://api.openrouteservice.org/v2/directions")
                .requestFactory(fabrica)
                .defaultHeader("Authorization", chave)
                .build();
    }

    /** hora nula = hora atual (o fuso padrão da JVM é America/Sao_Paulo). */
    public RotaResponse calcular(double origemLat, double origemLon, double destinoLat, double destinoLon,
            Integer hora, boolean mobilidadeReduzida, Set<Long> ignorar) {
        int h = hora != null ? hora : LocalTime.now().getHour();
        Ponto origem = new Ponto(origemLat, origemLon), destino = new Ponto(destinoLat, destinoLon);

        Trajeto comum = pedir("foot-walking", origem, destino, List.of());
        if (comum == null) throw new RegraNegocioException("Não existe caminho a pé entre a origem e o destino");

        var ativas = ocorrencias.listar(List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA), null, null);
        var evitar = aEvitar(ativas, h >= 19 || h < 6, mobilidadeReduzida, ignorar != null ? ignorar : Set.of(),
                origem, destino);
        if (evitar.isEmpty() && !mobilidadeReduzida) // nada a desviar: economiza um pedido ao ORS
            return new RotaResponse(comum, comum, "Nenhum problema avisado neste caminho: a rota comum já está livre.");

        Trajeto livre = pedir(mobilidadeReduzida ? "wheelchair" : "foot-walking", origem, destino, evitar);
        return new RotaResponse(comum, livre, livre == null ? AVISO_SEM_DESVIO : null);
    }

    /** Alertas que a rota Caminho Livre contorna. */
    static List<Ocorrencia> aEvitar(List<Ocorrencia> ativas, boolean noturno, boolean mobilidadeReduzida,
            Set<Long> ignorar, Ponto origem, Ponto destino) {
        double minLat = Math.min(origem.lat(), destino.lat()), maxLat = Math.max(origem.lat(), destino.lat());
        double minLon = Math.min(origem.lon(), destino.lon()), maxLon = Math.max(origem.lon(), destino.lon());
        double mLat = graus(MARGEM_M), mLon = graus(MARGEM_M) / Math.cos(Math.toRadians(origem.lat()));
        return ativas.stream().filter(o -> {
            var c = o.getCategoria();
            var l = o.getLocalizacao();
            if (!o.getStatus().ativa() || ignorar.contains(c.getId())) return false;
            if (l.getLatitude() < minLat - mLat || l.getLatitude() > maxLat + mLat
                    || l.getLongitude() < minLon - mLon || l.getLongitude() > maxLon + mLon) return false;
            if (perto(l.getLatitude(), l.getLongitude(), origem) || perto(l.getLatitude(), l.getLongitude(), destino))
                return false;
            boolean bloqueia = mobilidadeReduzida && "S".equals(c.getBloqueiaMobilidade());
            return bloqueia || (noturno ? c.getPesoNoturno() : c.getPesoBase()) >= PESO_MIN_DESVIO;
        }).toList();
    }

    /** null = o OpenRouteService não achou caminho (com os desvios pedidos). */
    private Trajeto pedir(String perfil, Ponto origem, Ponto destino, List<Ocorrencia> evitar) {
        Map<String, Object> corpo = new java.util.HashMap<>(Map.of("coordinates",
                List.of(List.of(origem.lon(), origem.lat()), List.of(destino.lon(), destino.lat()))));
        if (!evitar.isEmpty())
            corpo.put("options", Map.of("avoid_polygons", Map.of("type", "MultiPolygon",
                    "coordinates", evitar.stream().map(RotaService::quadrado).toList())));
        try {
            OrsResposta r = ors.post().uri("/{perfil}/geojson", perfil).body(corpo).retrieve().body(OrsResposta.class);
            var f = r.features().get(0);
            return new Trajeto(f.geometry().coordinates().stream().map(c -> new Ponto(c.get(1), c.get(0))).toList(),
                    f.properties().summary().distance());
        } catch (HttpClientErrorException e) {
            OrsErro erro = e.getResponseBodyAs(OrsErro.class);
            int codigo = erro != null && erro.error() != null ? erro.error().code() : 0;
            if (codigo == 2010) // ponto longe de qualquer rua (no mar, no meio do mato)
                throw new RegraNegocioException("Não encontramos uma rua perto da origem ou do destino");
            if (codigo == 2009) return null; // sem caminho possível
            if (codigo == 2004) throw new RegraNegocioException("Origem e destino estão longe demais para ir a pé");
            throw e; // chave inválida, cota estourada...: 503 no GlobalExceptionHandler
        }
    }

    /** Polígono GeoJSON (lon, lat) de lado 2 × RAIO_DESVIO_M em volta do alerta. */
    private static List<List<List<Double>>> quadrado(Ocorrencia o) {
        double lat = o.getLocalizacao().getLatitude(), lon = o.getLocalizacao().getLongitude();
        double dLat = graus(RAIO_DESVIO_M), dLon = dLat / Math.cos(Math.toRadians(lat));
        return List.of(List.of(List.of(lon - dLon, lat - dLat), List.of(lon + dLon, lat - dLat),
                List.of(lon + dLon, lat + dLat), List.of(lon - dLon, lat + dLat), List.of(lon - dLon, lat - dLat)));
    }

    private static boolean perto(double lat, double lon, Ponto p) {
        return TrechoService.distanciaM(lat, lon, p.lat(), p.lon()) <= FOLGA_PONTAS_M;
    }

    private static double graus(double metros) {
        return metros / 111_320;
    }

    record OrsResposta(List<Feature> features) {
        record Feature(Geometria geometry, Propriedades properties) {
        }
        record Geometria(List<List<Double>> coordinates) {
        }
        record Propriedades(Resumo summary) {
        }
        record Resumo(double distance) {
        }
    }

    record OrsErro(Detalhe error) {
        record Detalhe(int code, String message) {
        }
    }
}
