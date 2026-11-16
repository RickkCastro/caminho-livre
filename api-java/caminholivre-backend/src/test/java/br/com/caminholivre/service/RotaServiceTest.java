package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import org.springframework.web.client.RestClientException;

import br.com.caminholivre.dto.RotaResponse.Ponto;
import br.com.caminholivre.exception.GlobalExceptionHandler;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;

/** Quais alertas a rota Caminho Livre contorna e como os erros do OpenRouteService viram resposta. */
class RotaServiceTest {

    // Origem e destino ~1,1 km de distância; o alerta fica no meio do caminho.
    final Ponto origem = new Ponto(-23.560, -46.650);
    final Ponto destino = new Ponto(-23.570, -46.650);
    final double meioLat = -23.565;

    static Ocorrencia alerta(long idCategoria, double lat, double pesoBase, double pesoNoturno, String bloqueia,
            StatusOcorrencia status) {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setId(idCategoria);
        c.setPesoBase(pesoBase);
        c.setPesoNoturno(pesoNoturno);
        c.setBloqueiaMobilidade(bloqueia);
        Localizacao l = new Localizacao();
        l.setLatitude(lat);
        l.setLongitude(-46.650);
        Ocorrencia o = new Ocorrencia();
        o.setCategoria(c);
        o.setLocalizacao(l);
        o.setStatus(status);
        return o;
    }

    List<Ocorrencia> evitar(List<Ocorrencia> ativas, boolean noturno, boolean mobilidade, Set<Long> ignorar) {
        return RotaService.aEvitar(ativas, noturno, mobilidade, ignorar, origem, destino);
    }

    @Test
    void traduzOsErrosDoOpenRouteService() {
        var semRua = assertThrows(RegraNegocioException.class, () -> RotaService.semCaminho(2010));
        assertEquals("Não encontramos uma rua perto da origem ou do destino", semRua.getMessage());
        assertThrows(RegraNegocioException.class, () -> RotaService.semCaminho(2004)); // longe demais
        assertTrue(RotaService.semCaminho(2009)); // caminhoLivre = null + aviso
        assertFalse(RotaService.semCaminho(2001)); // demais: o erro sobe e vira 503
        assertFalse(RotaService.semCaminho(0));
    }

    @Test
    void falhaDoServicoDeRotasVira503() {
        var r = new GlobalExceptionHandler().rotasIndisponivel(new RestClientException("cota"));
        assertEquals(503, r.getStatusCode().value());
        assertEquals("Serviço de rotas indisponível. Tente de novo em instantes.", r.getBody().erro());
    }

    @Test
    void desviaSoDoQueTemPesoNaHora() {
        var buraco = alerta(3, meioLat, 3, 4, "N", StatusOcorrencia.ABERTA);
        var ruaEscura = alerta(6, meioLat, 1, 6, "N", StatusOcorrencia.ABERTA);

        assertEquals(List.of(buraco), evitar(List.of(buraco, ruaEscura), false, false, Set.of()));
        assertEquals(List.of(buraco, ruaEscura), evitar(List.of(buraco, ruaEscura), true, false, Set.of()));
    }

    @Test
    void degrauLeveSoBloqueiaComMobilidadeReduzida() {
        var degrauLeve = alerta(1, meioLat, 1, 1, "S", StatusOcorrencia.CONFIRMADA);

        assertTrue(evitar(List.of(degrauLeve), false, false, Set.of()).isEmpty());
        assertEquals(List.of(degrauLeve), evitar(List.of(degrauLeve), false, true, Set.of()));
    }

    @Test
    void ignoraCategoriasDesligadasEAlertasInativos() {
        var alagamento = alerta(9, meioLat, 6, 6, "N", StatusOcorrencia.ABERTA);
        var resolvido = alerta(9, meioLat, 6, 6, "N", StatusOcorrencia.RESOLVIDA);

        assertTrue(evitar(List.of(alagamento), false, false, Set.of(9L)).isEmpty());
        assertTrue(evitar(List.of(resolvido), false, false, Set.of()).isEmpty());
    }

    @Test
    void naoDesviaDeAlertaNaOrigemNemLongeDoTrajeto() {
        var naOrigem = alerta(9, origem.lat() + 0.0002, 6, 6, "N", StatusOcorrencia.ABERTA); // ~22 m
        var longe = alerta(9, -23.700, 6, 6, "N", StatusOcorrencia.ABERTA); // ~14 km ao sul

        assertTrue(evitar(List.of(naOrigem, longe), false, false, Set.of()).isEmpty());
    }
}
