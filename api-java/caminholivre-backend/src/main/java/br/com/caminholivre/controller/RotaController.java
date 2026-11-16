package br.com.caminholivre.controller;

import java.util.Set;

import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.dto.RotaResponse;
import br.com.caminholivre.service.RotaService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/rotas")
public class RotaController {

    private final RotaService rotas;

    public RotaController(RotaService rotas) {
        this.rotas = rotas;
    }

    /** Público: rota comum + Caminho Livre. Ponto fora da área mapeada = 422. */
    @GetMapping
    public RotaResponse calcular(@RequestParam double origemLat, @RequestParam double origemLon,
            @RequestParam double destinoLat, @RequestParam double destinoLon,
            @RequestParam(required = false) @Min(0) @Max(23) Integer hora,
            @RequestParam(defaultValue = "N") @Pattern(regexp = "[SN]") String mobilidadeReduzida,
            @RequestParam(required = false) Set<Long> ignorar) {
        return rotas.calcular(origemLat, origemLon, destinoLat, destinoLon, hora, "S".equals(mobilidadeReduzida),
                ignorar);
    }
}
