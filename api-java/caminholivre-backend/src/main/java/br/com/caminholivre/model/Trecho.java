package br.com.caminholivre.model;

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
    @Column(name = "distancia_m")
    private Double distanciaM;

    @Pattern(regexp = "[SN]")
    private String iluminado = "S";
}
