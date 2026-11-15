package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.AtualizarUsuarioRequest;
import br.com.caminholivre.dto.OcorrenciaDetalhe;
import br.com.caminholivre.dto.PreferenciaDto;
import br.com.caminholivre.dto.UsuarioPublico;
import br.com.caminholivre.dto.UsuarioResponse;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.OcorrenciaService;
import br.com.caminholivre.service.PreferenciaService;
import br.com.caminholivre.service.UsuarioService;
import jakarta.validation.Valid;

/** Tudo em /usuarios/{id} é só do próprio usuário: 401 sem login, 403 para outro id. */
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarios;
    private final PreferenciaService preferencias;
    private final OcorrenciaService ocorrencias;

    public UsuarioController(UsuarioService usuarios, PreferenciaService preferencias, OcorrenciaService ocorrencias) {
        this.usuarios = usuarios;
        this.preferencias = preferencias;
        this.ocorrencias = ocorrencias;
    }

    /** Lista pública reduzida (sem e-mail), só com login. */
    @GetMapping
    public List<UsuarioPublico> listar(
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return usuarios.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscar(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return usuarios.buscar(id, logado);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Long id, @RequestBody @Valid AtualizarUsuarioRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return usuarios.atualizar(id, r, logado);
    }

    @GetMapping("/{id}/preferencias")
    public List<PreferenciaDto> preferencias(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return preferencias.listar(id, logado);
    }

    @PutMapping("/{id}/preferencias")
    public List<PreferenciaDto> salvarPreferencias(@PathVariable Long id,
            @RequestBody List<@Valid PreferenciaDto> novas,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return preferencias.salvar(id, novas, logado);
    }

    @GetMapping("/{id}/ocorrencias")
    public List<OcorrenciaDetalhe> ocorrencias(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.listarDoUsuario(id, logado);
    }
}
