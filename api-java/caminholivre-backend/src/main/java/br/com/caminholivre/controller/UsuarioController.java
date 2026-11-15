package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.OcorrenciaDetalhe;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.OcorrenciaService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final OcorrenciaService ocorrencias;

    public UsuarioController(OcorrenciaService ocorrencias) {
        this.ocorrencias = ocorrencias;
    }

    /** Histórico de alertas: só o próprio usuário (401 sem login, 403 para outro id). */
    @GetMapping("/{id}/ocorrencias")
    public List<OcorrenciaDetalhe> ocorrencias(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.listarDoUsuario(id, logado);
    }
}
