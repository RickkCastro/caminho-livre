package br.com.caminholivre.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.CategoriaOcorrencia;

public interface CategoriaRepository extends JpaRepository<CategoriaOcorrencia, Long> {
}
