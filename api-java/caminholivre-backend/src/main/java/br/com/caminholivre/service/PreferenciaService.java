package br.com.caminholivre.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.dto.PreferenciaDto;
import br.com.caminholivre.model.PreferenciaRota;
import br.com.caminholivre.model.Usuario;
import br.com.caminholivre.repository.PreferenciaRotaRepository;

@Service
public class PreferenciaService {

    private final PreferenciaRotaRepository preferencias;
    private final CategoriaService categorias;

    public PreferenciaService(PreferenciaRotaRepository preferencias, CategoriaService categorias) {
        this.preferencias = preferencias;
        this.categorias = categorias;
    }

    /** Uma linha por categoria; a que o usuário nunca ajustou vem como S. */
    public List<PreferenciaDto> listar(Long idUsuario, Usuario logado) {
        AuthService.exigirProprio(logado, idUsuario);
        Map<Long, String> salvas = preferencias.findByIdUsuario(idUsuario).stream()
                .collect(Collectors.toMap(PreferenciaRota::getIdCategoria, PreferenciaRota::getConsiderar));
        return categorias.listar().stream()
                .map(c -> new PreferenciaDto(c.getId(), salvas.getOrDefault(c.getId(), "S")))
                .toList();
    }

    /** Grava as enviadas (categoria inexistente = 404); as que não vieram ficam como estavam. */
    @Transactional
    public List<PreferenciaDto> salvar(Long idUsuario, List<PreferenciaDto> novas, Usuario logado) {
        AuthService.exigirProprio(logado, idUsuario);
        for (PreferenciaDto p : novas) {
            categorias.buscar(p.idCategoria());
            preferencias.save(new PreferenciaRota(idUsuario, p.idCategoria(), p.considerar()));
        }
        return listar(idUsuario, logado);
    }
}
