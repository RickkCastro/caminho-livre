package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.RotaFavoritaRequest;
import br.com.caminholivre.exception.AcessoNegadoException;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.RotaFavorita;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.RotaFavoritaRepository;

class RotaFavoritaServiceTest {

    final RotaFavoritaRepository favoritas = mock(RotaFavoritaRepository.class);
    final LocalizacaoService localizacoes = mock(LocalizacaoService.class);
    final RotaFavoritaService service = new RotaFavoritaService(favoritas, localizacoes);

    static Usuario usuario(Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return u;
    }

    @Test
    void salvaNoNomeDeQuemEstaLogado() {
        when(localizacoes.buscar(any())).thenReturn(new Localizacao());
        when(favoritas.save(any())).thenAnswer(i -> i.getArgument(0));

        RotaFavorita f = service.criar(usuario(7L), new RotaFavoritaRequest(1L, 2L, "  Casa → Trabalho "));

        assertEquals(7L, f.getIdUsuario());
        assertEquals("Casa → Trabalho", f.getApelido());
    }

    @Test
    void origemIgualDestinoDa422() {
        assertThrows(RegraNegocioException.class,
                () -> service.criar(usuario(7L), new RotaFavoritaRequest(1L, 1L, "Volta")));
        verify(favoritas, never()).save(any());
    }

    @Test
    void soODonoApaga() {
        RotaFavorita f = new RotaFavorita();
        f.setIdUsuario(7L);
        when(favoritas.findById(3L)).thenReturn(Optional.of(f));

        assertThrows(AcessoNegadoException.class, () -> service.excluir(3L, usuario(8L)));
        verify(favoritas, never()).delete(any());

        service.excluir(3L, usuario(7L));
        verify(favoritas).delete(f);
    }
}
