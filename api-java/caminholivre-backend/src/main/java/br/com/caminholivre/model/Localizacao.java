package br.com.caminholivre.model;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Ponto geográfico: vértice do grafo de ruas ou local de um alerta. */
@Entity
@Table(name = "localizacao")
@Getter @Setter @NoArgsConstructor
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @DecimalMin("-90") @DecimalMax("90")
    @JdbcTypeCode(SqlTypes.NUMERIC) @Column(precision = 9, scale = 6)
    private Double latitude;

    @NotNull @DecimalMin("-180") @DecimalMax("180")
    @JdbcTypeCode(SqlTypes.NUMERIC) @Column(precision = 9, scale = 6)
    private Double longitude;

    @Size(max = 150)
    private String logradouro;

    @Size(max = 80)
    private String bairro;
}
