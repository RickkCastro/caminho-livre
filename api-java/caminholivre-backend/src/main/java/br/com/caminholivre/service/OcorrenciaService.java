package br.com.caminholivre.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.NovaOcorrenciaRequest;
import br.com.caminholivre.dto.OcorrenciaDetalhe;
import br.com.caminholivre.dto.OcorrenciaResumo;
import br.com.caminholivre.exception.AcessoNegadoException;
import br.com.caminholivre.exception.RecursoNaoEncontradoException;
import br.com.caminholivre.model.Localizacao;
import br.com.caminholivre.model.Ocorrencia;
import br.com.caminholivre.model.StatusOcorrencia;
import br.com.caminholivre.model.TipoCategoria;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.ConfirmacaoRepository;
import br.com.caminholivre.repository.LocalizacaoRepository;
import br.com.caminholivre.repository.OcorrenciaRepository;
import br.com.caminholivre.repository.UsuarioRepository;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrencias;
    private final LocalizacaoRepository localizacoes;
    private final ConfirmacaoRepository confirmacoes;
    private final CategoriaService categorias;
    private final UsuarioRepository usuarios;

    /** Pontos por alerta enviado. */
    static final int PONTOS_ALERTA = 10;

    public OcorrenciaService(OcorrenciaRepository ocorrencias, LocalizacaoRepository localizacoes,
            ConfirmacaoRepository confirmacoes, CategoriaService categorias, UsuarioRepository usuarios) {
        this.usuarios = usuarios;
        this.ocorrencias = ocorrencias;
        this.localizacoes = localizacoes;
        this.confirmacoes = confirmacoes;
        this.categorias = categorias;
    }

    /** Novo alerta nasce ABERTO, vale 15 dias e dá +10 pontos ao autor. Categoria inexistente = 404. */
    @Transactional
    public OcorrenciaDetalhe criar(Usuario autor, NovaOcorrenciaRequest r) {
        Ocorrencia o = new Ocorrencia();
        o.setUsuario(autor);
        o.setLocalizacao(new Localizacao());
        preencher(o, r);
        o.setStatus(StatusOcorrencia.ABERTA);
        LocalDateTime agora = LocalDateTime.now();
        o.setDtRegistro(agora);
        o.setDtExpiracao(agora.plusDays(Ocorrencia.DIAS_VALIDADE));
        Ocorrencia salva = ocorrencias.save(o);
        usuarios.somarPontos(autor.getId(), PONTOS_ALERTA);
        return OcorrenciaDetalhe.de(salva, 0, 0, true);
    }

    /** Mapa: expira os vencidos antes de listar; sem status = só ativas (ABERTA e CONFIRMADA). */
    @Transactional
    public List<OcorrenciaResumo> listar(TipoCategoria tipo, StatusOcorrencia status, String bairro) {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        var filtro = status != null ? List.of(status) : List.of(StatusOcorrencia.ABERTA, StatusOcorrencia.CONFIRMADA);
        String b = bairro == null || bairro.isBlank() ? null : bairro.trim();
        return ocorrencias.listar(filtro, tipo, b).stream().map(OcorrenciaResumo::de).toList();
    }

    @Transactional
    public OcorrenciaDetalhe detalhar(Long id, Usuario logado) {
        ocorrencias.expirarVencidas(LocalDateTime.now());
        return detalhe(buscar(id), logado);
    }

    /** Histórico do próprio usuário, todos os status. */
    @Transactional
    public List<OcorrenciaDetalhe> listarDoUsuario(Long idUsuario, Usuario logado) {
        AuthService.exigirProprio(logado, idUsuario);
        ocorrencias.expirarVencidas(LocalDateTime.now());
        List<Ocorrencia> doUsuario = ocorrencias.findByUsuarioIdOrderByDtRegistroDesc(idUsuario);
        if (doUsuario.isEmpty()) return List.of();

        // totais de todas numa consulta só (2 contagens por alerta pesariam no Render)
        Map<Long, long[]> totais = new HashMap<>();
        for (Object[] linha : confirmacoes.contarPorOcorrencia(doUsuario.stream().map(Ocorrencia::getId).toList())) {
            long[] t = totais.computeIfAbsent((Long) linha[0], k -> new long[2]);
            t["S".equals(linha[1]) ? 0 : 1] = (Long) linha[2];
        }
        return doUsuario.stream().map(o -> {
            long[] t = totais.getOrDefault(o.getId(), new long[2]);
            return OcorrenciaDetalhe.de(o, t[0], t[1], true);
        }).toList();
    }

    /** Só o autor edita; muda categoria, ponto, descrição e foto, mantendo status e datas. */
    @Transactional
    public OcorrenciaDetalhe atualizar(Long id, NovaOcorrenciaRequest r, Usuario logado) {
        Ocorrencia o = doAutor(id, logado);
        preencher(o, r);
        return detalhe(ocorrencias.save(o), logado);
    }

    /** Só o autor exclui; as avaliações saem junto (ON DELETE CASCADE). */
    @Transactional
    public void excluir(Long id, Usuario logado) {
        ocorrencias.delete(doAutor(id, logado));
    }

    private Ocorrencia buscar(Long id) {
        return ocorrencias.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ocorrência " + id + " não encontrada"));
    }

    private Ocorrencia doAutor(Long id, Usuario logado) {
        Ocorrencia o = buscar(id);
        if (!autor(o, logado)) throw new AcessoNegadoException("Só quem enviou o alerta pode alterá-lo");
        return o;
    }

    private static boolean autor(Ocorrencia o, Usuario u) {
        return u != null && o.getUsuario() != null && o.getUsuario().getId().equals(u.getId());
    }

    private void preencher(Ocorrencia o, NovaOcorrenciaRequest r) {
        o.setCategoria(categorias.buscar(r.idCategoria()));
        Localizacao l = o.getLocalizacao();
        l.setLatitude(r.latitude());
        l.setLongitude(r.longitude());
        l.setLogradouro(r.logradouro());
        l.setBairro(r.bairro());
        o.setLocalizacao(localizacoes.save(l));
        o.setDescricao(r.descricao());
        o.setFotoUrl(r.fotoUrl());
    }

    private OcorrenciaDetalhe detalhe(Ocorrencia o, Usuario logado) {
        return OcorrenciaDetalhe.de(o, confirmacoes.countByOcorrenciaIdAndConfirma(o.getId(), "S"),
                confirmacoes.countByOcorrenciaIdAndConfirma(o.getId(), "N"), autor(o, logado));
    }
}
