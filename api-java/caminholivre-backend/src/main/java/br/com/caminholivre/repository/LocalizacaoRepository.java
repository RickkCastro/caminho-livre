package br.com.caminholivre.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.Localizacao;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {
}
