package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaDetalhe;
import br.com.caminholivre.exception.AcessoNegadoException;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;

class OcorrenciaServiceTest {

    final OcorrenciaRepository ocorrencias = mock(OcorrenciaRepository.class);
    final LocalizacaoRepository localizacoes = mock(LocalizacaoRepository.class);
    final ConfirmacaoRepository confirmacoes = mock(ConfirmacaoRepository.class);
    final CategoriaService categorias = mock(CategoriaService.class);
    final OcorrenciaService service = new OcorrenciaService(ocorrencias, localizacoes, confirmacoes, categorias);

    final NovaOcorrenciaRequest pedido = new NovaOcorrenciaRequest(1L, -23.55, -46.63, null, "Sé", "Calçada quebrada", null);

    @Test
    void novoAlertaNasceAbertoEValeQuinzeDias() {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setNome("Calçada");
        c.setTipo(TipoCategoria.ACESSIBILIDADE);
        when(categorias.buscar(1L)).thenReturn(c);
        when(localizacoes.save(any())).thenAnswer(i -> i.getArgument(0));
        when(ocorrencias.save(any())).thenAnswer(i -> i.getArgument(0));

        OcorrenciaDetalhe r = service.criar(new Usuario(), pedido);

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

    static Usuario usuario(Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return u;
    }

    /** Alerta 10 da pessoa 1, com 2 👍 e 1 👎. */
    Ocorrencia alertaDe(Usuario autor) {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setNome("Buraco");
        Ocorrencia o = new Ocorrencia();
        o.setId(10L);
        o.setUsuario(autor);
        o.setCategoria(c);
        o.setLocalizacao(new Localizacao());
        when(ocorrencias.findById(10L)).thenReturn(Optional.of(o));
        when(confirmacoes.countByOcorrenciaIdAndConfirma(10L, "S")).thenReturn(2L);
        when(confirmacoes.countByOcorrenciaIdAndConfirma(10L, "N")).thenReturn(1L);
        return o;
    }

    @Test
    void detalheTrazTotaisEMinhaSoParaOAutor() {
        alertaDe(usuario(1L));

        OcorrenciaDetalhe meu = service.detalhar(10L, usuario(1L));
        assertEquals(2, meu.totalConfirma());
        assertEquals(1, meu.totalNega());
        assertTrue(meu.minha());
        assertFalse(service.detalhar(10L, usuario(2L)).minha());
        assertFalse(service.detalhar(10L, null).minha());
    }

    @Test
    void detalheInexistenteDa404() {
        when(ocorrencias.findById(99L)).thenReturn(Optional.empty());
        var e = assertThrows(RecursoNaoEncontradoException.class, () -> service.detalhar(99L, null));
        assertEquals("Ocorrência 99 não encontrada", e.getMessage());
    }

    @Test
    void soOAutorEditaOuExclui() {
        alertaDe(usuario(1L));

        assertThrows(AcessoNegadoException.class, () -> service.atualizar(10L, pedido, usuario(2L)));
        assertThrows(AcessoNegadoException.class, () -> service.excluir(10L, usuario(2L)));
        verify(ocorrencias, never()).delete(any());

        service.excluir(10L, usuario(1L));
        verify(ocorrencias).delete(any());
    }

    @Test
    void alertaAnonimizadoNinguemAltera() {
        alertaDe(null);
        assertThrows(AcessoNegadoException.class, () -> service.excluir(10L, usuario(1L)));
    }

    @Test
    void historicoDeOutroUsuarioDa403() {
        assertThrows(AcessoNegadoException.class, () -> service.listarDoUsuario(1L, usuario(2L)));
    }
}
