package br.com.caminholivre.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;

import br.com.caminholivre.dto.RankingBairros;
import br.com.caminholivre.dto.RankingBairros.Bairro;
import br.com.caminholivre.model.CategoriaOcorrencia;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;

class RankingServiceTest {

    static Ocorrencia alerta(String bairro, double pesoBase) {
        CategoriaOcorrencia c = new CategoriaOcorrencia();
        c.setPesoBase(pesoBase);
        Localizacao l = new Localizacao();
        l.setBairro(bairro);
        Ocorrencia o = new Ocorrencia();
        o.setCategoria(c);
        o.setLocalizacao(l);
        return o;
    }

    @Test
    void ordenaPelaSomaDoPesoBase() {
        RankingBairros r = RankingService.montar(List.of("Sé", "Liberdade", "Paraíso"),
                List.of(alerta("Sé", 2), alerta("Sé", 1.5), alerta("Liberdade", 1)));

        assertEquals(List.of(new Bairro("Sé", 3.5, 2), new Bairro("Liberdade", 1, 1)), r.piores());
        assertEquals(List.of(new Bairro("Paraíso", 0, 0)), r.melhores()); // quem está nos piores não repete
    }

    @Test
    void limitaACincoEmCadaLista() {
        var bairros = List.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L");
        var alertas = bairros.stream().map(b -> alerta(b, 1)).toList();

        RankingBairros r = RankingService.montar(bairros, alertas);

        assertEquals(5, r.melhores().size());
        assertEquals(5, r.piores().size());
        assertTrue(r.melhores().stream().noneMatch(r.piores()::contains));
    }
}
