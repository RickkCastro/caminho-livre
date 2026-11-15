package br.com.caminholivre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Localizacao;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {

    @Query("select distinct l.bairro from Localizacao l where l.bairro is not null")
    List<String> listarBairros();
}
