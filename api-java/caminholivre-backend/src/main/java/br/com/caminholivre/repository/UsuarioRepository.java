package br.com.caminholivre.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.caminholivre.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByGoogleId(String googleId);

    /** Soma no banco (sem ler antes): dois envios ao mesmo tempo não perdem pontos. */
    @Modifying
    @Query("update Usuario u set u.pontos = u.pontos + :pontos where u.id = :id")
    int somarPontos(Long id, int pontos);

    List<Usuario> findAllByOrderByPontosDescNomeAsc();
}
