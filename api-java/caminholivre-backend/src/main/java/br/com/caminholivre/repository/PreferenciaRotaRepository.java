package br.com.caminholivre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.PreferenciaRota;

public interface PreferenciaRotaRepository extends JpaRepository<PreferenciaRota, PreferenciaRota.Chave> {

    List<PreferenciaRota> findByIdUsuario(Long idUsuario);
}
