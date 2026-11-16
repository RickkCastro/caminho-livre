package br.com.caminholivre.dto;

import java.time.LocalDateTime;

import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;

/** Ocorrência completa, sem dados do autor; minha = o usuário logado é o autor. */
public record OcorrenciaDetalhe(Long id, String categoria, TipoCategoria tipo, Double latitude, Double longitude,
        StatusOcorrencia status, String descricao, String fotoUrl, String bairro, LocalDateTime dtRegistro,
        LocalDateTime dtExpiracao, long totalConfirma, long totalNega, boolean minha) {

    public static OcorrenciaDetalhe de(Ocorrencia o, long totalConfirma, long totalNega, boolean minha) {
        return new OcorrenciaDetalhe(o.getId(), o.getCategoria().getNome(), o.getCategoria().getTipo(),
                o.getLocalizacao().getLatitude(), o.getLocalizacao().getLongitude(), o.getStatus(), o.getDescricao(),
                o.getFotoUrl(), o.getLocalizacao().getBairro(), o.getDtRegistro(), o.getDtExpiracao(),
                totalConfirma, totalNega, minha);
    }
}
