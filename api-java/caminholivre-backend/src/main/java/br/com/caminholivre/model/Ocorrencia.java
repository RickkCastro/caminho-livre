package br.com.caminholivre.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Alerta enviado por um usuário. */
@Entity
@Table(name = "ocorrencia")
@Getter @Setter @NoArgsConstructor
public class Ocorrencia {

    public static final int DIAS_VALIDADE = 15;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Autor; null depois que a conta é excluída (anonimização LGPD). */
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_categoria")
    private CategoriaOcorrencia categoria;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_localizacao")
    private Localizacao localizacao;

    @Size(max = 500)
    private String descricao;

    @Size(max = 500)
    private String fotoUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusOcorrencia status = StatusOcorrencia.ABERTA;

    private LocalDateTime dtRegistro;

    private LocalDateTime dtExpiracao;
}
