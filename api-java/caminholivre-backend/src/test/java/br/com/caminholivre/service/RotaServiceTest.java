package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.RotaResponse;
import br.com.caminholivre.dto.RotaResponse.Ponto;
import br.com.caminholivre.dto.TrechoPeso;
import br.com.caminholivre.dto.TrechoPeso.Vertice;
import br.com.caminholivre.exception.RegraNegocioException;

/** Quadrado A-B-D e A-C-D: por B é mais curto, por C é a alternativa. */
class RotaServiceTest {

    final Vertice a = new Vertice(1L, -23.560, -46.650);
    final Vertice b = new Vertice(2L, -23.560, -46.649);
    final Vertice c = new Vertice(3L, -23.561, -46.650);
    final Vertice d = new Vertice(4L, -23.561, -46.649);

    TrechoPeso t(long id, Vertice o, Vertice de, double dist, double peso, boolean bloqueado) {
        return new TrechoPeso(id, o, de, dist, peso, bloqueado);
    }

    RotaResponse rota(List<TrechoPeso> grafo) {
        return RotaService.montar(grafo, a.lat(), a.lon(), d.lat(), d.lon());
    }

    static Ponto p(Vertice v) {
        return new Ponto(v.lat(), v.lon());
    }

    @Test
    void comumPegaOMaisCurtoECaminhoLivreDesviaDoPesado() {
        var r = rota(List.of(t(1, a, b, 100, 1000, false), t(2, b, d, 100, 100, false),
                t(3, a, c, 150, 150, false), t(4, d, c, 150, 150, false))); // trecho 4 cadastrado ao contrário

        assertEquals(List.of(p(a), p(b), p(d)), r.comum().pontos());
        assertEquals(200, r.comum().distanciaM());
        assertEquals(List.of(p(a), p(c), p(d)), r.caminhoLivre().pontos());
        assertEquals(300, r.caminhoLivre().distanciaM());
        assertNull(r.aviso());
    }

    @Test
    void semAlternativaSemBloqueioCaminhoLivreNuloComAviso() {
        var r = rota(List.of(t(1, a, b, 100, 100, true), t(2, b, d, 100, 100, false),
                t(3, a, c, 150, 150, true), t(4, c, d, 150, 150, false)));

        assertEquals(200, r.comum().distanciaM());
        assertNull(r.caminhoLivre());
        assertNotNull(r.aviso());
    }

    @Test
    void pontoForaDaAreaDa422() {
        var grafo = List.of(t(1, a, b, 100, 100, false));
        assertThrows(RegraNegocioException.class, () -> RotaService.montar(grafo, -23.0, -46.0, b.lat(), b.lon()));
    }

    @Test
    void grafoDesconexoDa422() {
        var grafo = List.of(t(1, a, b, 100, 100, false), t(2, c, d, 100, 100, false));
        assertThrows(RegraNegocioException.class, () -> rota(grafo));
    }

    @Test
    void origemIgualDestinoDevolveUmPonto() {
        var r = RotaService.montar(List.of(t(1, a, b, 100, 100, false)), a.lat(), a.lon(), a.lat(), a.lon());
        assertEquals(List.of(p(a)), r.comum().pontos());
        assertEquals(0, r.comum().distanciaM());
    }
}
