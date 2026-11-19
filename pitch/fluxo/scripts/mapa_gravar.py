"""Grava o plano das cenas (ed-mapa).

Uso: py mapa_gravar.py <pasta do vídeo> <plano_entrada.json>
- confere cobertura: c01 começa em 0, sem buraco nem sobreposição, e vai até o fim da fala;
- preserva o status 'aprovada' das cenas já gravadas;
- grava o bloco `mapa` (versão nova, cortes_versao) e edicao/mapa/plano_vNN.md.
"""
import json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import ver  # noqa: E402


def mmss(t):
    m, s = divmod(t, 60)
    return f"{int(m)}:{s:04.1f}"


def conferir(cenas, fim_fala):
    erros = []
    if abs(cenas[0]["inicio"]) > 1e-6:
        erros.append("c01 não começa em 0")
    for a, b in zip(cenas, cenas[1:]):
        if abs(a["fim"] - b["inicio"]) > 1e-6:
            erros.append(f"{a['id']}→{b['id']}: {'buraco' if b['inicio'] > a['fim'] else 'sobreposição'} {a['fim']}→{b['inicio']}")
    for c in cenas:
        if c["fim"] <= c["inicio"]:
            erros.append(f"{c['id']}: duração inválida")
        for g in c.get("gatilhos", []):
            if not c["inicio"] - 1e-6 <= g[1] <= c["fim"] + 1e-6:
                erros.append(f"{c['id']}: gatilho '{g[0]}' {g[1]} fora da cena")
    if cenas[-1]["fim"] < fim_fala:
        erros.append(f"última cena termina antes do fim da fala ({fim_fala})")
    return erros


def main():
    pasta, entrada = Path(sys.argv[1]), Path(sys.argv[2])
    plano = json.loads(entrada.read_text(encoding="utf-8"))
    d = ver.ler(pasta)
    frases = json.loads((pasta / "edicao/preparar/frases.json").read_text(encoding="utf-8"))
    fim_fala = frases[-1]["fim"] - d["cortes"]["segmentos"][0]["inicio"]  # shortcut: um segmento só; com cortes reais, usar o conversor do mapa_fala

    cenas = plano["cenas"]
    erros = conferir(cenas, fim_fala)
    if erros:
        print("NÃO gravado:\n  " + "\n  ".join(erros))
        sys.exit(1)

    antigo = {c["id"]: c for c in d.get("mapa", {}).get("cenas", [])}
    for c in cenas:
        if antigo.get(c["id"], {}).get("aprovada"):
            c["aprovada"] = True
        c.setdefault("aprovada", False)

    versao = d.get("mapa", {}).get("versao", 0) + 1
    d["mapa"] = {"versao": versao, "cortes_versao": d["cortes"].get("versao", 1),
                 "trechos": plano["trechos"], "cenas": cenas, "assets": plano["assets"]}
    ver.gravar(pasta, d)

    L = [f"# Plano das cenas v{versao:02d}", "", f"Corte v{d['mapa']['cortes_versao']} · {len(cenas)} cenas · tempos na narração limpa", ""]
    trechos = plano["trechos"]
    for t in trechos:
        L.append(f"## {t['id']} ({mmss(t['inicio'])}–{mmss(t['fim'])})")
        for c in cenas:
            if t["inicio"] - 1e-6 <= c["inicio"] < t["fim"] - 1e-6:
                g = "; ".join(f"\"{x[0]}\" {mmss(x[1])} {x[2]}" for x in c.get("gatilhos", []))
                ok = " ✓" if c["aprovada"] else ""
                L.append(f"- **{c['id']}**{ok} · {mmss(c['inicio'])}–{mmss(c['fim'])} · {c['tipo']} · {c['descricao']}")
                if c.get("arquivo"):
                    L.append(f"  - arquivo: {c['arquivo']}")
                L.append(f"  - gatilhos: {g}")
                L.append(f"  - troca: {c['troca']}")
                for k, v in c.get("storyboard", {}).items():
                    L.append(f"  - {k}: {v}")
        L.append("")
    L.append("## Assets")
    L += [f"- {a['id']} · {a['tipo']} · {a['busca']}" + (f" · {a['obs']}" if a.get("obs") else "") for a in plano["assets"]]
    arq = pasta / f"edicao/mapa/plano_v{versao:02d}.md"
    arq.write_text("\n".join(L) + "\n", encoding="utf-8")
    print(f"gravado: mapa v{versao}, {len(cenas)} cenas -> {arq}")


if __name__ == "__main__":
    main()
