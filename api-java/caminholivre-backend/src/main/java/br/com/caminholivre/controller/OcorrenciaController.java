package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.ConfirmacaoRequest;
import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaDetalhe;
import br.com.caminholivre.dto.OcorrenciaResumo;
import br.com.caminholivre.dto.TotaisResponse;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.ConfirmacaoService;
import br.com.caminholivre.service.OcorrenciaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrencias;
    private final ConfirmacaoService confirmacoes;

    public OcorrenciaController(OcorrenciaService ocorrencias, ConfirmacaoService confirmacoes) {
        this.ocorrencias = ocorrencias;
        this.confirmacoes = confirmacoes;
    }

    /** Público: visitante também vê o mapa. */
    @GetMapping
    public List<OcorrenciaResumo> listar(@RequestParam(required = false) TipoCategoria tipo,
            @RequestParam(required = false) StatusOcorrencia status, @RequestParam(required = false) String bairro) {
        return ocorrencias.listar(tipo, status, bairro);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OcorrenciaDetalhe criar(@RequestBody @Valid NovaOcorrenciaRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.criar(AuthService.exigir(logado), r);
    }

    /** Público; com login, minha diz se o alerta é do usuário. */
    @GetMapping("/{id}")
    public OcorrenciaDetalhe detalhar(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.detalhar(id, logado);
    }

    @PutMapping("/{id}")
    public OcorrenciaDetalhe atualizar(@PathVariable Long id, @RequestBody @Valid NovaOcorrenciaRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return ocorrencias.atualizar(id, r, AuthService.exigir(logado));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        ocorrencias.excluir(id, AuthService.exigir(logado));
    }

    @PostMapping("/{id}/confirmacoes")
    @ResponseStatus(HttpStatus.CREATED)
    public TotaisResponse avaliar(@PathVariable Long id, @RequestBody @Valid ConfirmacaoRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        return confirmacoes.avaliar(AuthService.exigir(logado), id, r.confirma());
    }
}
