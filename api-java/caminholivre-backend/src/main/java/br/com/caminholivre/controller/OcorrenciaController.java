package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaResponse;
import br.com.caminholivre.dto.OcorrenciaResumo;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.OcorrenciaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrencias;

    public OcorrenciaController(OcorrenciaService ocorrencias) {
        this.ocorrencias = ocorrencias;
    }

    /** Público: visitante também vê o mapa. */
    @GetMapping
    public List<OcorrenciaResumo> listar(@RequestParam(required = false) TipoCategoria tipo,
            @RequestParam(required = false) StatusOcorrencia status, @RequestParam(required = false) String bairro) {
        return ocorrencias.listar(tipo, status, bairro);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OcorrenciaResponse criar(@RequestBody @Valid NovaOcorrenciaRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.criar(AuthService.exigir(logado), r);
    }
}
