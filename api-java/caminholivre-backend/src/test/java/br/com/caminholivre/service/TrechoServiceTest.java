package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.TrechoPeso;
import br.com.caminholivre.model.*;

class TrechoServiceTest {

    final Localizacao a = ponto(1L, -23.56, -46.65);
    final Localizacao b = ponto(2L, -23.56, -46.649); // ~100 m de a
    final Trecho trecho = trecho(a, b, 100.0);

    static Localizacao ponto(Long id, double lat, double lon) {
        Localizacao l = new Localizacao();
        l.setId(id);
        l.setLatitude(lat);
        l.setLongitude(lon);
        return l;
    }

    static Trecho trecho(Localizacao o, Localizacao d, double dist) {
        Trecho t = new Trecho();
        t.setId(10L);
        t.setOrigem(o);
        t.setDestino(d);
        t.setDistanciaM(dist);
        return t;
    }

    static Ocorrencia alerta(Long idCategoria, Localizacao onde, StatusOcorrencia status, String bloqueia) {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setId(idCategoria);
        c.setPesoBase(2.0);
        c.setPesoNoturno(4.0);
        c.setBloqueiaMobilidade(bloqueia);
        Ocorrencia o = new Ocorrencia();
        o.setCategoria(c);
        o.setLocalizacao(onde);
        o.setStatus(status);
        return o;
    }

    TrechoPeso pesar(List<Ocorrencia> ativas, boolean noturno, boolean mobilidade, Set<Long> ignorar) {
        return TrechoService.pesar(List.of(trecho), ativas, noturno, mobilidade, ignorar).get(0);
    }

    @Test
    void semAlertaPesoEhADistancia() {
        assertEquals(100.0, pesar(List.of(), false, false, Set.of()).peso());
    }

    @Test
    void deDiaUsaPesoBaseENoiteUsaPesoNoturno() {
        var o = List.of(alerta(1L, ponto(99L, -23.56, -46.65), StatusOcorrencia.ABERTA, "N"));
        assertEquals(300.0, pesar(o, false, false, Set.of()).peso(), 1e-9);
        assertEquals(500.0, pesar(o, true, false, Set.of()).peso(), 1e-9);
    }

    @Test
    void categoriaIgnoradaNaoSoma() {
        var o = List.of(alerta(1L, a, StatusOcorrencia.ABERTA, "N"));
        assertEquals(100.0, pesar(o, false, false, Set.of(1L)).peso());
    }

    @Test
    void alertaAMaisDe30mNaoPesa() {
        var longe = ponto(99L, -23.5605, -46.6495); // ~70 m das duas pontas
        assertEquals(100.0, pesar(List.of(alerta(1L, longe, StatusOcorrencia.ABERTA, "N")), false, false, Set.of()).peso());
    }

    @Test
    void bloqueiaSoComMobilidadeReduzida() {
        var o = List.of(alerta(1L, b, StatusOcorrencia.CONFIRMADA, "S"));
        assertTrue(pesar(o, false, true, Set.of()).bloqueado());
        assertFalse(pesar(o, false, false, Set.of()).bloqueado());
    }

    @Test
    void expiradaEResolvidaSaoIgnoradas() {
        var o = List.of(alerta(1L, a, StatusOcorrencia.EXPIRADA, "S"), alerta(2L, b, StatusOcorrencia.RESOLVIDA, "S"));
        TrechoPeso p = pesar(o, false, true, Set.of());
        assertEquals(100.0, p.peso());
        assertFalse(p.bloqueado());
    }

    @Test
    void haversineDaCercaDe100m() {
        assertEquals(102, TrechoService.distanciaM(-23.56, -46.65, -23.56, -46.649), 2);
    }
}
