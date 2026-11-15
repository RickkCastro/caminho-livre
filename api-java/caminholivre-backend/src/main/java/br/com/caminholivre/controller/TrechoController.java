package br.com.caminholivre.controller;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.config.GoogleTokenFilter;
import br.com.caminholivre.dto.TrechoPeso;
import br.com.caminholivre.dto.TrechoRequest;
import br.com.caminholivre.model.Trecho;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.service.AuthService;
import br.com.caminholivre.service.TrechoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/trechos")
public class TrechoController {

    private final TrechoService trechos;

    public TrechoController(TrechoService trechos) {
        this.trechos = trechos;
    }

    @GetMapping
    public List<Trecho> listar() {
        return trechos.listar();
    }

    /** Peso de cada trecho no Caminho Livre, sem identificar o usuário (LGPD). */
    @GetMapping("/pesos")
    public List<TrechoPeso> pesos(@RequestParam(required = false) @Min(0) @Max(23) Integer hora,
            @RequestParam(defaultValue = "N") @Pattern(regexp = "[SN]") String mobilidadeReduzida,
            @RequestParam(required = false) Set<Long> ignorar) {
        return trechos.calcularPesos(hora, "S".equals(mobilidadeReduzida), ignorar);
    }

    @GetMapping("/{id}")
    public Trecho buscar(@PathVariable Long id) {
        return trechos.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Trecho criar(@RequestBody @Valid TrechoRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return trechos.criar(r);
    }

    @PutMapping("/{id}")
    public Trecho atualizar(@PathVariable Long id, @RequestBody @Valid TrechoRequest r,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        return trechos.atualizar(id, r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
            @RequestAttribute(name = GoogleTokenFilter.USUARIO_LOGADO, required = false) Usuario logado) {
        AuthService.exigir(logado);
        trechos.excluir(id);
    }
}
