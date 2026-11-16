package br.com.caminholivre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.RotaFavorita;

public interface RotaFavoritaRepository extends JpaRepository<RotaFavorita, Long> {

    List<RotaFavorita> findByIdUsuarioOrderByDtCriacaoDesc(Long idUsuario);

    @Modifying
    @Query("delete from RotaFavorita r where r.idUsuario = :idUsuario")
    int apagarDoUsuario(Long idUsuario);
}
