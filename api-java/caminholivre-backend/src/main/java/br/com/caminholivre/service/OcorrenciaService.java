package br.com.caminholivre.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaResponse;
import br.com.caminholivre.dto.OcorrenciaResumo;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrencias;
    private final LocalizacaoRepository localizacoes;
    private final CategoriaService categorias;

    public OcorrenciaService(OcorrenciaRepository ocorrencias, LocalizacaoRepository localizacoes,
            CategoriaService categorias) {
        this.ocorrencias = ocorrencias;
        this.localizacoes = localizacoes;
        this.categorias = categorias;
    }

    /** Novo alerta nasce ABERTO e vale 15 dias. Categoria inexistente = 404. */
    @Transactional
    public OcorrenciaResponse criar(Usuario autor, NovaOcorrenciaRequest r) {
        var categoria = categorias.buscar(r.idCategoria());

        Localizacao l = new Localizacao();
        l.setLatitude(r.latitude());
        l.setLongitude(r.longitude());
        l.setLogradouro(r.logradouro());
        l.setBairro(r.bairro());

        Ocorrencia o = new Ocorrencia();
        o.setUsuario(autor);
        o.setCategoria(categoria);
        o.setLocalizacao(localizacoes.save(l));
        o.setDescricao(r.descricao());
        o.setFotoUrl(r.fotoUrl());
        o.setStatus(StatusOcorrencia.ABERTA);
        LocalDateTime agora = LocalDateTime.now();
        o.setDtRegistro(agora);
        o.setDtExpiracao(agora.plusDays(Ocorrencia.DIAS_VALIDADE));
        return OcorrenciaResponse.de(ocorrencias.save(o));
    }

    /** Mapa: expira os vencidos antes de listar; sem status = só ativas (ABERTA e CONFIRMADA). */
    @Transactional
    public List<OcorrenciaResumo> listar(TipoCategoria tipo, StatusOcorrencia status, String bairro) {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        var filtro = status != null ? List.of(status) : List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA);
        String b = bairro == null || bairro.isBlank() ? null : bairro.trim();
        return ocorrencias.listar(filtro, tipo, b).stream().map(OcorrenciaResumo::de).toList();
    }
}
