package br.com.caminholivre.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.AtualizarUsuarioRequest;
import br.com.caminholivre.dto.UsuarioPublico;
import br.com.caminholivre.dto.UsuarioResponse;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.PreferenciaRotaRepository;
import br.com.caminholivre.repository.RotaFavoritaRepository;
import br.com.caminholivre.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final OcorrenciaRepository ocorrencias;
    private final ConfirmacaoRepository confirmacoes;
    private final PreferenciaRotaRepository preferencias;
    private final RotaFavoritaRepository favoritas;

    public UsuarioService(UsuarioRepository usuarios, OcorrenciaRepository ocorrencias,
            ConfirmacaoRepository confirmacoes, PreferenciaRotaRepository preferencias,
            RotaFavoritaRepository favoritas) {
        this.usuarios = usuarios;
        this.ocorrencias = ocorrencias;
        this.confirmacoes = confirmacoes;
        this.preferencias = preferencias;
        this.favoritas = favoritas;
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

    /**
     * LGPD, numa transação só: alertas ficam anônimos (seguem no mapa) e os dados pessoais saem.
     * Feito aqui, e não só pelos ON DELETE do banco, para não depender de como o script criou as FKs.
     */
    @Transactional
    public void excluir(Long id, Usuario logado) {
        AuthService.exigirProprio(logado, id);
        Usuario u = carregar(id);
        ocorrencias.anonimizarPorUsuario(id);
        confirmacoes.apagarDoUsuario(id);
        preferencias.apagarDoUsuario(id);
        favoritas.apagarDoUsuario(id);
        usuarios.delete(u);
    }

    private Usuario carregar(Long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário " + id + " não encontrado"));
    }
}
