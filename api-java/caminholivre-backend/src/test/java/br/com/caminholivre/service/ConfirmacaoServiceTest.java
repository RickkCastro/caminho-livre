package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.TotaisResponse;
import br.com.caminholivre.exception.ConflitoException;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;

class ConfirmacaoServiceTest {

    final ConfirmacaoRepository confirmacoes = mock(ConfirmacaoRepository.class);
    final OcorrenciaRepository ocorrencias = mock(OcorrenciaRepository.class);
    final ConfirmacaoService service = new ConfirmacaoService(confirmacoes, ocorrencias);

    final Usuario autor = usuario(1L);
    final Usuario eu = usuario(2L);
    final Ocorrencia alerta = new Ocorrencia();

    static Usuario usuario(Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return u;
    }

    /** Alerta 10 com os totais que o banco devolve depois de gravar o voto. */
    void cenario(StatusOcorrencia status, long sim, long nao) {
        alerta.setId(10L);
        alerta.setUsuario(autor);
        alerta.setStatus(status);
        when(ocorrencias.findById(10L)).thenReturn(Optional.of(alerta));
        when(confirmacoes.countByOcorrenciaIdAndConfirma(10L, "S")).thenReturn(sim);
        when(confirmacoes.countByOcorrenciaIdAndConfirma(10L, "N")).thenReturn(nao);
    }

    @Test
    void autorNaoAvaliaOProprioAlerta() {
        cenario(StatusOcorrencia.ABERTA, 0, 0);
        assertThrows(RegraNegocioException.class, () -> service.avaliar(autor, 10L, true));
        verify(confirmacoes, never()).save(any());
    }

    @Test
    void segundaAvaliacaoDaMesmaPessoaDa409() {
        cenario(StatusOcorrencia.ABERTA, 1, 0);
        when(confirmacoes.existsByOcorrenciaIdAndUsuarioId(10L, 2L)).thenReturn(true);
        assertThrows(ConflitoException.class, () -> service.avaliar(eu, 10L, true));
    }

    @Test
    void alertaExpiradoOuResolvidoNaoAceitaAvaliacao() {
        cenario(StatusOcorrencia.EXPIRADA, 0, 0);
        assertThrows(RegraNegocioException.class, () -> service.avaliar(eu, 10L, true));
        alerta.setStatus(StatusOcorrencia.RESOLVIDA);
        assertThrows(RegraNegocioException.class, () -> service.avaliar(eu, 10L, false));
    }

    @Test
    void terceiroJoinhaConfirma() {
        cenario(StatusOcorrencia.ABERTA, 3, 1);
        TotaisResponse r = service.avaliar(eu, 10L, true);
        assertEquals(new TotaisResponse(StatusOcorrencia.CONFIRMADA, 3, 1), r);
    }

    @Test
    void terceiroNegativoResolve() {
        cenario(StatusOcorrencia.CONFIRMADA, 2, 3);
        assertEquals(StatusOcorrencia.RESOLVIDA, service.avaliar(eu, 10L, false).status());
    }

    @Test
    void tresDeCadaLadoNegativoPrevalece() {
        cenario(StatusOcorrencia.CONFIRMADA, 3, 3);
        assertEquals(StatusOcorrencia.RESOLVIDA, service.avaliar(eu, 10L, false).status());
    }

    @Test
    void abaixoDoLimiteContinuaAberta() {
        cenario(StatusOcorrencia.ABERTA, 2, 2);
        assertEquals(StatusOcorrencia.ABERTA, service.avaliar(eu, 10L, true).status());
    }
}
