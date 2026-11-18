package br.com.caminholivre.model;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Aresta não direcionada do grafo de ruas entre duas localizações. */
@Entity
@Table(name = "trecho")
@Getter @Setter @NoArgsConstructor
public class Trecho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_origem")
    private Localizacao origem;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_destino")
    private Localizacao destino;

    @NotNull @Positive
    @JdbcTypeCode(SqlTypes.NUMERIC) @Column(name = "distancia_m", precision = 7, scale = 1)
    private Double distanciaM;

    @Pattern(regexp = "[SN]")
    @JdbcTypeCode(SqlTypes.CHAR) @Column(length = 1) // CHAR(1) S/N no Oracle
    private String iluminado = "S";
}
