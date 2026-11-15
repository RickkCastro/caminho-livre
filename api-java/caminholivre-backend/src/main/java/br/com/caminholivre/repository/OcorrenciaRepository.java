package br.com.caminholivre.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    /** Filtros nulos são ignorados; bairro sem diferenciar maiúsculas. */
    @Query("""
            select o from Ocorrencia o join fetch o.categoria c join fetch o.localizacao l
            where o.status in :status
              and (:tipo is null or c.tipo = :tipo)
              and (:bairro is null or lower(l.bairro) = lower(:bairro))
            order by o.dtRegistro desc""")
    List<Ocorrencia> listar(Collection<StatusOcorrencia> status, TipoCategoria tipo, String bairro);

    /** Só ABERTA expira; CONFIRMADA continua até ser resolvida. */
    @Modifying
    @Query("""
            update Ocorrencia o set o.status = br.com.caminholivre.model.StatusOcorrencia.EXPIRADA
            where o.status = br.com.caminholivre.model.StatusOcorrencia.ABERTA and o.dtExpiracao < :agora""")
    int expirarVencidas(LocalDateTime agora);
}
