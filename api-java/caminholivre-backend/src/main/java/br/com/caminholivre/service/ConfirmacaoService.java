package br.com.caminholivre.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.TotaisResponse;
import br.com.caminholivre.exception.ConflitoException;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.exception.RegraNegocioException;
import br.com.caminholivre.model.Confirmacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.UsuarioRepository;

@Service
public class ConfirmacaoService {

    /** Votos (total, não saldo) que mudam o status. */
    static final int LIMITE = 3;

    /** Pontos para quem avalia. */
    static final int PONTOS_AVALIACAO = 2;

    private final ConfirmacaoRepository confirmacoes;
    private final OcorrenciaRepository ocorrencias;
    private final UsuarioRepository usuarios;

    public ConfirmacaoService(ConfirmacaoRepository confirmacoes, OcorrenciaRepository ocorrencias,
            UsuarioRepository usuarios) {
        this.confirmacoes = confirmacoes;
        this.ocorrencias = ocorrencias;
        this.usuarios = usuarios;
    }

    /** 3 👍 → CONFIRMADA; 3 👎 → RESOLVIDA (👎 prevalece). Autor, alerta inativo = 422; voto repetido = 409. */
    @Transactional
    public TotaisResponse avaliar(Usuario usuario, Long idOcorrencia, boolean confirma) {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        Ocorrencia o = ocorrencias.findById(idOcorrencia)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ocorrência " + idOcorrencia + " não encontrada"));
        if (o.getUsuario() != null && o.getUsuario().getId().equals(usuario.getId()))
            throw new RegraNegocioException("Você não pode avaliar o próprio alerta");
        if (!o.getStatus().ativa())
            throw new RegraNegocioException("Este alerta está " + o.getStatus() + " e não aceita mais avaliações");
        if (confirmacoes.existsByOcorrenciaIdAndUsuarioId(idOcorrencia, usuario.getId()))
            throw new ConflitoException("Você já avaliou este alerta");

        Confirmacao c = new Confirmacao();
        c.setOcorrencia(o);
        c.setUsuario(usuario);
        c.setConfirma(confirma ? "S" : "N");
        confirmacoes.save(c);
        usuarios.somarPontos(usuario.getId(), PONTOS_AVALIACAO);

        long sim = confirmacoes.countByOcorrenciaIdAndConfirma(idOcorrencia, "S");
        long nao = confirmacoes.countByOcorrenciaIdAndConfirma(idOcorrencia, "N");
        if (nao >= LIMITE) o.setStatus(StatusOcorrencia.RESOLVIDA);
        else if (sim >= LIMITE) o.setStatus(StatusOcorrencia.CONFIRMADA);
        ocorrencias.save(o);
        return new TotaisResponse(o.getStatus(), sim, nao);
    }
}
