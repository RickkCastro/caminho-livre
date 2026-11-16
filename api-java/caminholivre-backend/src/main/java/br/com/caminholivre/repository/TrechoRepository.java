package br.com.caminholivre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Trecho;

public interface TrechoRepository extends JpaRepository<Trecho, Long> {

    /** Grafo inteiro numa consulta só. */
    @Query("select t from Trecho t join fetch t.origem join fetch t.destino")
    List<Trecho> listarComPontos();
}
