package br.com.caminholivre.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Confirmacao;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {

    boolean existsByOcorrenciaIdAndUsuarioId(Long idOcorrencia, Long idUsuario);

    long countByOcorrenciaIdAndConfirma(Long idOcorrencia, String confirma);

    /** Totais de várias ocorrências numa consulta só: linhas [idOcorrencia, confirma (S/N), quantidade]. */
    @Query("""
            select c.ocorrencia.id, c.confirma, count(c) from Confirmacao c
            where c.ocorrencia.id in :ids group by c.ocorrencia.id, c.confirma""")
    List<Object[]> contarPorOcorrencia(Collection<Long> ids);

    @Modifying
    @Query("delete from Confirmacao c where c.usuario.id = :idUsuario")
    int apagarDoUsuario(Long idUsuario);
}
