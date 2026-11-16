package br.com.caminholivre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.PreferenciaRota;

public interface PreferenciaRotaRepository extends JpaRepository<PreferenciaRota, PreferenciaRota.Chave> {

    List<PreferenciaRota> findByIdUsuario(Long idUsuario);

    @Modifying
    @Query("delete from PreferenciaRota p where p.idUsuario = :idUsuario")
    int apagarDoUsuario(Long idUsuario);
}
