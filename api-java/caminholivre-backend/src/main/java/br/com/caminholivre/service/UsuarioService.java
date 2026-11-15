package br.com.caminholivre.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.AtualizarUsuarioRequest;
import br.com.caminholivre.dto.UsuarioPublico;
import br.com.caminholivre.dto.UsuarioResponse;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;

    public UsuarioService(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    public List<UsuarioPublico> listar() {
        return usuarios.findAll().stream().map(UsuarioPublico::de).toList();
    }

    /** Perfil completo (com e-mail): só o próprio usuário. */
    public UsuarioResponse buscar(Long id, Usuario logado) {
        AuthService.exigirProprio(logado, id);
        return UsuarioResponse.de(carregar(id), false);
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, AtualizarUsuarioRequest r, Usuario logado) {
        AuthService.exigirProprio(logado, id);
        Usuario u = carregar(id);
        if (r.nome() != null) u.setNome(r.nome().trim());
        if (r.fotoUrl() != null) u.setFotoUrl(r.fotoUrl());
        if (r.mobilidadeReduzida() != null) u.setMobilidadeReduzida(r.mobilidadeReduzida());
        return UsuarioResponse.de(usuarios.save(u), false);
    }

    private Usuario carregar(Long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário " + id + " não encontrado"));
    }
}
