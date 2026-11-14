package br.com.caminholivre.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.caminholivre.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByGoogleId(String googleId);
}
