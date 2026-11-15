package br.com.caminholivre.dto;

import java.time.LocalDateTime;

import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;

/** Ocorrência sem os dados do autor. */
public record OcorrenciaResponse(Long id, String categoria, TipoCategoria tipo, Double latitude, Double longitude,
        StatusOcorrencia status, String descricao, String fotoUrl, String bairro, LocalDateTime dtRegistro,
        LocalDateTime dtExpiracao) {

    public static OcorrenciaResponse de(Ocorrencia o) {
        return new OcorrenciaResponse(o.getId(), o.getCategoria().getNome(), o.getCategoria().getTipo(),
                o.getLocalizacao().getLatitude(), o.getLocalizacao().getLongitude(), o.getStatus(), o.getDescricao(),
                o.getFotoUrl(), o.getLocalizacao().getBairro(), o.getDtRegistro(), o.getDtExpiracao());
    }
}
