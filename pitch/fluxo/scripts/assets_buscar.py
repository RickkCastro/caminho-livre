"""Baixa opções de ícone do Iconify e monta a folha de contato numerada.

Uso: py assets_buscar.py <pasta do vídeo> <lista.json>
lista.json: {"a03": {"nome": "andador", "opcoes": ["material-symbols:assist-walker", ...]}, ...}
Saída: edicao/assets/_opcoes/<id>_<n>_<prefixo>-<nome>.svg e edicao/assets/_folha_icones[_vNN].png
Nunca sobrescreve SVG já baixado nem folha anterior.
"""
import json, sys, html
from pathlib import Path
import requests

LICENCAS = {"lucide": "ISC", "ph": "MIT", "tabler": "MIT", "mdi": "Apache 2.0",
            "material-symbols": "Apache 2.0"}  # conferido em api.iconify.design/collections, 18/11/2026


def baixar(icone, destino):
    if destino.exists():
        return destino.read_text(encoding="utf-8")
    pre, nome = icone.split(":")
    r = requests.get(f"https://api.iconify.design/{pre}/{nome}.svg", params={"height": "auto"}, timeout=20)
    r.raise_for_status()
    assert r.text.lstrip().startswith("<svg"), f"{icone}: resposta não é SVG"
    destino.write_text(r.text, encoding="utf-8")
    return r.text


def livre(p):
    n = 2
    while p.exists():
        p = p.with_name(f"{p.stem.split('_v')[0]}_v{n:02d}{p.suffix}"); n += 1
    return p


def main(pasta, lista_json):
    pasta = Path(pasta)
    lista = json.loads(Path(lista_json).read_text(encoding="utf-8"))
    ops = pasta / "edicao/assets/_opcoes"; ops.mkdir(parents=True, exist_ok=True)
    linhas, saida = [], {}
    for aid, item in lista.items():
        celulas = []
        for n, icone in enumerate(item["opcoes"], 1):
            pre = icone.split(":")[0]
            arq = ops / f"{aid}_{n}_{icone.replace(':', '-')}.svg"
            svg = baixar(icone, arq)
            saida.setdefault(aid, []).append({"n": n, "icone": icone, "arquivo": str(arq.relative_to(pasta)).replace("\\", "/"),
                                              "licenca": LICENCAS.get(pre, "?")})
            celulas.append(f'<div class="op"><div class="ic">{svg}</div><b>{n}</b><small>{html.escape(icone)}</small></div>')
        linhas.append(f'<div class="lin"><div class="rot">{aid}<br><span>{html.escape(item["nome"])}</span></div>{"".join(celulas)}</div>')
    pagina = f"""<html><head><style>
body{{margin:0;background:#e8f4ef;font-family:Inter,Segoe UI,sans-serif;color:#2a4b25;padding:24px}}
.lin{{display:flex;align-items:center;gap:18px;margin-bottom:14px}}
.rot{{width:150px;font-weight:700;font-size:22px}} .rot span{{font-weight:400;font-size:16px}}
.op{{background:#fff;border-radius:14px;width:190px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 6px #0001}}
.ic svg{{width:64px;height:64px;color:#2a4b25}} b{{font-size:20px;margin-top:6px}} small{{font-size:11px;color:#557}}
</style></head><body>{"".join(linhas)}</body></html>"""
    from playwright.sync_api import sync_playwright
    folha = livre(pasta / "edicao/assets/_folha_icones.png")
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 820, "height": 400})
        pg.set_content(pagina); pg.screenshot(path=str(folha), full_page=True); b.close()
    (pasta / "edicao/assets/_opcoes/opcoes.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    print(folha)


if __name__ == "__main__":
    main(*sys.argv[1:3])
