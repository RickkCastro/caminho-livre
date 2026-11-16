package br.com.caminholivre.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Pessoa autenticada pelo Google; a API não guarda senha. */
@Entity
@Table(name = "usuario")
@Getter @Setter @NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    private String nome;

    @NotBlank @Email @Size(max = 150)
    private String email;

    @NotBlank @Size(max = 255)
    private String googleId;

    @Pattern(regexp = "[SN]")
    private String mobilidadeReduzida = "N";

    @Size(max = 500)
    private String fotoUrl;

    @PositiveOrZero
    private Integer pontos = 0;

    private LocalDateTime dtCadastro = LocalDateTime.now();
}
