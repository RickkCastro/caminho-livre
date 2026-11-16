package br.com.caminholivre.dto;

import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;

/** Pino do mapa: sem autor nem descrição. */
public record OcorrenciaResumo(Long id, String categoria, TipoCategoria tipo, Double latitude, Double longitude,
        StatusOcorrencia status) {

    public static OcorrenciaResumo de(Ocorrencia o) {
        return new OcorrenciaResumo(o.getId(), o.getCategoria().getNome(), o.getCategoria().getTipo(),
                o.getLocalizacao().getLatitude(), o.getLocalizacao().getLongitude(), o.getStatus());
    }
}
