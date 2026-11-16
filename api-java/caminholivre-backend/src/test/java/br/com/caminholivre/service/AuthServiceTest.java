package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import br.com.caminholivre.dto.UsuarioResponse;
import br.com.caminholivre.exception.NaoAutorizadoException;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.UsuarioRepository;

class AuthServiceTest {

    final UsuarioRepository usuarios = mock(UsuarioRepository.class);
    final AuthService auth = spy(new AuthService(usuarios, "client-id-de-teste"));

    private void tokenValido() {
        GoogleIdToken.Payload p = new GoogleIdToken.Payload().setSubject("g-123").setEmail("ana@exemplo.com");
        p.set("name", "Ana");
        p.set("picture", "https://foto");
        doReturn(p).when(auth).verificar("token");
    }

    @Test
    void primeiroAcessoCriaContaComDadosDoGoogle() {
        tokenValido();
        when(usuarios.findByGoogleId("g-123")).thenReturn(Optional.empty());
        when(usuarios.save(any())).thenAnswer(i -> {
            Usuario u = i.getArgument(0);
            u.setId(7L);
            return u;
        });

        UsuarioResponse r = auth.entrar("token");

        assertTrue(r.primeiroAcesso());
        assertEquals(7L, r.id());
        assertEquals("Ana", r.nome());
        assertEquals("ana@exemplo.com", r.email());
        assertEquals("https://foto", r.fotoUrl());
        assertEquals(0, r.pontos());
        assertEquals("N", r.mobilidadeReduzida());
    }

    @Test
    void segundoAcessoDevolveContaExistenteSemCriar() {
        tokenValido();
        Usuario existente = new Usuario();
        existente.setId(7L);
        existente.setNome("Ana");
        when(usuarios.findByGoogleId("g-123")).thenReturn(Optional.of(existente));

        UsuarioResponse r = auth.entrar("token");

        assertFalse(r.primeiroAcesso());
        assertEquals(7L, r.id());
        verify(usuarios, never()).save(any());
    }

    @Test
    void tokenInvalidoDa401() {
        assertThrows(NaoAutorizadoException.class, () -> auth.entrar("nao-e-um-token"));
    }
}
