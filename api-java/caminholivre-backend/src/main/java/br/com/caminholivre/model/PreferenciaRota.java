package br.com.caminholivre.model;

import java.io.Serializable;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Se a rota do usuário considera (S) ou ignora (N) uma categoria; sem linha = S. */
@Entity
@Table(name = "preferencia_rota")
@IdClass(PreferenciaRota.Chave.class)
@Getter @Setter @NoArgsConstructor
public class PreferenciaRota {

    @Id
    private Long idUsuario;

    @Id
    private Long idCategoria;

    @Pattern(regexp = "[SN]")
    private String considerar = "S";

    public PreferenciaRota(Long idUsuario, Long idCategoria, String considerar) {
        this.idUsuario = idUsuario;
        this.idCategoria = idCategoria;
        this.considerar = considerar;
    }

    public record Chave(Long idUsuario, Long idCategoria) implements Serializable {
    }
}
