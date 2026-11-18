package br.com.caminholivre.model;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categoria_ocorrencia")
@Getter @Setter @NoArgsConstructor
public class CategoriaOcorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 50)
    private String nome;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;

    @NotNull @PositiveOrZero
    @JdbcTypeCode(SqlTypes.NUMERIC) @Column(precision = 5, scale = 2)
    private Double pesoBase;

    /** Usado entre 19h e 6h. */
    @NotNull @PositiveOrZero
    @JdbcTypeCode(SqlTypes.NUMERIC) @Column(precision = 5, scale = 2)
    private Double pesoNoturno;

    /** S = trecho intransponível para quem tem mobilidade reduzida. */
    @NotNull @Pattern(regexp = "[SN]")
    @JdbcTypeCode(SqlTypes.CHAR) @Column(length = 1) // CHAR(1) S/N no Oracle
    private String bloqueiaMobilidade = "N";
}
