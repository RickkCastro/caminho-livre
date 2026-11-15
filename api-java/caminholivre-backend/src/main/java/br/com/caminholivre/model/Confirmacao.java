package br.com.caminholivre.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Avaliação 👍 (S) ou 👎 (N) de um usuário sobre um alerta; uma por pessoa. */
@Entity
@Table(name = "confirmacao")
@Getter @Setter @NoArgsConstructor
public class Confirmacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ocorrencia")
    private Ocorrencia ocorrencia;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @NotNull @Pattern(regexp = "[SN]")
    private String confirma;

    private LocalDateTime dtConfirmacao = LocalDateTime.now();
}
