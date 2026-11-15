package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaResponse;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;

class OcorrenciaServiceTest {

    final OcorrenciaRepository ocorrencias = mock(OcorrenciaRepository.class);
    final LocalizacaoRepository localizacoes = mock(LocalizacaoRepository.class);
    final CategoriaService categorias = mock(CategoriaService.class);
    final OcorrenciaService service = new OcorrenciaService(ocorrencias, localizacoes, categorias);

    final NovaOcorrenciaRequest pedido = new NovaOcorrenciaRequest(1L, -23.55, -46.63, null, "Sé", "Calçada quebrada", null);

    @Test
    void novoAlertaNasceAbertoEValeQuinzeDias() {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setNome("Calçada");
        c.setTipo(TipoCategoria.ACESSIBILIDADE);
        when(categorias.buscar(1L)).thenReturn(c);
        when(localizacoes.save(any())).thenAnswer(i -> i.getArgument(0));
        when(ocorrencias.save(any())).thenAnswer(i -> i.getArgument(0));

        OcorrenciaResponse r = service.criar(new Usuario(), pedido);

        assertEquals(StatusOcorrencia.ABERTA, r.status());
        assertEquals(15, ChronoUnit.DAYS.between(r.dtRegistro(), r.dtExpiracao()));
        assertEquals("Sé", r.bairro());
        assertEquals(-23.55, r.latitude());
    }

    @Test
    void categoriaInexistenteDa404ENaoGrava() {
        when(categorias.buscar(1L)).thenThrow(new RecursoNaoEncontradoException("Categoria 1 não encontrada"));

        assertThrows(RecursoNaoEncontradoException.class, () -> service.criar(new Usuario(), pedido));
        verify(ocorrencias, never()).save(any());
    }

    @Test
    void mapaExpiraVencidosAntesEPorPadraoMostraSoAtivas() {
        service.listar(null, null, "  ");

        InOrder ordem = inOrder(ocorrencias);
        ordem.verify(ocorrencias).expirarVencidas(any());
        ordem.verify(ocorrencias).listar(List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA), null, null);
    }

    @Test
    void filtroDeStatusSubstituiOPadrao() {
        service.listar(TipoCategoria.CLIMA, StatusOcorrencia.EXPIRADA, " Sé ");

        verify(ocorrencias).listar(List.of(StatusOcorrencia.EXPIRADA), TipoCategoria.CLIMA, "Sé");
    }
}
