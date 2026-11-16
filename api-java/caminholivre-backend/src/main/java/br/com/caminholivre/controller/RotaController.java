package br.com.caminholivre.controller;

import java.util.Set;

import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.dto.RotaResponse;
import br.com.caminholivre.service.RotaService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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

    /** Público: rota comum + Caminho Livre. Coordenada fora da faixa = 400; ponto sem rua por perto = 422. */
    @GetMapping
    public RotaResponse calcular(@RequestParam @DecimalMin("-90") @DecimalMax("90") double origemLat,
            @RequestParam @DecimalMin("-180") @DecimalMax("180") double origemLon,
            @RequestParam @DecimalMin("-90") @DecimalMax("90") double destinoLat,
            @RequestParam @DecimalMin("-180") @DecimalMax("180") double destinoLon,
            @RequestParam(required = false) @Min(0) @Max(23) Integer hora,
            @RequestParam(defaultValue = "N") @Pattern(regexp = "[SN]") String mobilidadeReduzida,
            @RequestParam(required = false) Set<Long> ignorar) {
        return rotas.calcular(origemLat, origemLon, destinoLat, destinoLon, hora, "S".equals(mobilidadeReduzida),
                ignorar);
    }
}
