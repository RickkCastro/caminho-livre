package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.AtualizarUsuarioRequest;
import br.com.caminholivre.dto.PreferenciaDto;
import br.com.caminholivre.exception.AcessoNegadoException;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.PreferenciaRota;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.PreferenciaRotaRepository;
import br.com.caminholivre.repository.RotaFavoritaRepository;
import br.com.caminholivre.repository.UsuarioRepository;

/** UsuarioService e PreferenciaService: o que o front usa na tela de perfil e no onboarding. */
class PerfilServiceTest {

    final UsuarioRepository usuarios = mock(UsuarioRepository.class);
    final PreferenciaRotaRepository prefs = mock(PreferenciaRotaRepository.class);
    final CategoriaService categorias = mock(CategoriaService.class);
    final OcorrenciaRepository ocorrencias = mock(OcorrenciaRepository.class);
    final ConfirmacaoRepository confirmacoes = mock(ConfirmacaoRepository.class);
    final RotaFavoritaRepository favoritas = mock(RotaFavoritaRepository.class);
    final UsuarioService usuarioService = new UsuarioService(usuarios, ocorrencias, confirmacoes, prefs, favoritas);
    final PreferenciaService preferenciaService = new PreferenciaService(prefs, categorias);

    static Usuario usuario(Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        u.setNome("Ana");
        u.setFotoUrl("https://antiga");
        return u;
    }

    static CategoriaOcorrencia categoria(Long id) {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setId(id);
        return c;
    }

    @Test
    void putParcialMudaSoOQueVeio() {
        Usuario salvo = usuario(1L);
        when(usuarios.findById(1L)).thenReturn(Optional.of(salvo));
        when(usuarios.save(any())).thenAnswer(i -> i.getArgument(0));

        var r = usuarioService.atualizar(1L, new AtualizarUsuarioRequest(null, null, "S"), usuario(1L));

        assertEquals("S", r.mobilidadeReduzida());
        assertEquals("Ana", r.nome());
        assertEquals("https://antiga", r.fotoUrl());
        assertFalse(r.primeiroAcesso());
    }

    @Test
    void perfilDeOutraPessoaDa403() {
        assertThrows(AcessoNegadoException.class, () -> usuarioService.buscar(1L, usuario(2L)));
        assertThrows(AcessoNegadoException.class,
                () -> usuarioService.atualizar(1L, new AtualizarUsuarioRequest("X", null, null), usuario(2L)));
        verify(usuarios, never()).save(any());
    }

    @Test
    void preferenciaNuncaAjustadaVemComoS() {
        when(categorias.listar()).thenReturn(List.of(categoria(1L), categoria(2L)));
        when(prefs.findByIdUsuario(1L)).thenReturn(List.of(new PreferenciaRota(1L, 2L, "N")));

        assertEquals(List.of(new PreferenciaDto(1L, "S"), new PreferenciaDto(2L, "N")),
                preferenciaService.listar(1L, usuario(1L)));
    }

    @Test
    void salvarGravaCadaPreferenciaDoUsuario() {
        when(categorias.listar()).thenReturn(List.of());

        preferenciaService.salvar(1L, List.of(new PreferenciaDto(3L, "N")), usuario(1L));

        verify(categorias).buscar(3L);
        verify(prefs).save(argThat(p -> p.getIdUsuario() == 1L && p.getIdCategoria() == 3L
                && "N".equals(p.getConsiderar())));
    }

    @Test
    void preferenciasDeOutraPessoaDa403() {
        assertThrows(AcessoNegadoException.class,
                () -> preferenciaService.salvar(1L, List.of(new PreferenciaDto(3L, "N")), usuario(2L)));
        verify(prefs, never()).save(any());
    }

    @Test
    void excluirContaDeOutraPessoaDa403() {
        assertThrows(AcessoNegadoException.class, () -> usuarioService.excluir(1L, usuario(2L)));
        verify(usuarios, never()).delete(any());
        verify(ocorrencias, never()).anonimizarPorUsuario(any());
    }

    @Test
    void excluirAPropriaContaApagaOUsuario() {
        Usuario salvo = usuario(1L);
        when(usuarios.findById(1L)).thenReturn(Optional.of(salvo));

        usuarioService.excluir(1L, usuario(1L));

        var ordem = inOrder(ocorrencias, confirmacoes, prefs, favoritas, usuarios);
        ordem.verify(ocorrencias).anonimizarPorUsuario(1L);
        ordem.verify(confirmacoes).apagarDoUsuario(1L);
        ordem.verify(prefs).apagarDoUsuario(1L);
        ordem.verify(favoritas).apagarDoUsuario(1L);
        ordem.verify(usuarios).delete(salvo);
    }
}
