package br.com.caminholivre.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Confirmacao;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {

    boolean existsByOcorrenciaIdAndUsuarioId(Long idOcorrencia, Long idUsuario);

    long countByOcorrenciaIdAndConfirma(Long idOcorrencia, String confirma);

    @Modifying
    @Query("delete from Confirmacao c where c.usuario.id = :idUsuario")
    int apagarDoUsuario(Long idUsuario);
}
