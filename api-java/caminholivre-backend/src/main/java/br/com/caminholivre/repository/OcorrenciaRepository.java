package br.com.caminholivre.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.Ocorrencia;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
}
