package br.com.caminholivre.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Origem e destino que o usuário salvou com um apelido ("Casa → Trabalho"). */
@Entity
@Table(name = "rota_favorita")
@Getter @Setter @NoArgsConstructor
public class RotaFavorita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long idUsuario;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_origem")
    private Localizacao origem;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_destino")
    private Localizacao destino;

    @NotBlank @Size(max = 60)
    private String apelido;

    private LocalDateTime dtCriacao = LocalDateTime.now();
}
