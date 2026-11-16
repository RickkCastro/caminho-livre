package br.com.caminholivre.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.com.caminholivre.dto.PessoaRanking;
import br.com.caminholivre.dto.RankingBairros;
import br.com.caminholivre.service.RankingService;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService ranking;

    public RankingController(RankingService ranking) {
        this.ranking = ranking;
    }

    /** Público: top 5 bairros melhores e piores pela gravidade dos alertas ativos. */
    @GetMapping("/bairros")
    public RankingBairros bairros() {
        return ranking.bairros();
    }

    /** Público: pessoas por pontos (+10 por alerta, +2 por avaliação). */
    @GetMapping("/usuarios")
    public List<PessoaRanking> usuarios() {
        return ranking.usuarios();
    }
}
