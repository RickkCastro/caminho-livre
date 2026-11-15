package br.com.caminholivre.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.Confirmacao;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {

    boolean existsByOcorrenciaIdAndUsuarioId(Long idOcorrencia, Long idUsuario);

    long countByOcorrenciaIdAndConfirma(Long idOcorrencia, String confirma);
}
