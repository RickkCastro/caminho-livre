"""Estado do vídeo (edicao/projeto.json) sem abrir o arquivo inteiro.

Uso (pasta = C:\\Github\\caminho-livre\\pitch):
  py ver.py <pasta> --init <nome_projeto>        cria o projeto.json (não sobrescreve)
  py ver.py <pasta> status                      etapas, pendências, alertas, aprendizados
  py ver.py <pasta> <bloco> [--json]            resumo (ou JSON completo) de um bloco
  py ver.py <pasta> --set a.b.c <valor>         muda um campo (valor em JSON; senão texto)
  py ver.py <pasta> --set a.b.c @bloco.json     valor lido de arquivo (use no PowerShell para objetos/listas)
  py ver.py <pasta> --etapa iniciar=concluido   muda o status de uma etapa
  py ver.py <pasta> --pendencia <etapa> "<texto>" / --resolver p01
Teste: py ver.py --teste
"""
import json
import os
import sys
import tempfile
from pathlib import Path

ETAPAS = ["iniciar", "preparar", "cortes", "mapa", "assets", "animar", "som"]


def caminho(pasta):
    return Path(pasta) / "edicao" / "projeto.json"


def ler(pasta):
    return json.loads(caminho(pasta).read_text(encoding="utf-8"))


def gravar(pasta, d):
    p = caminho(pasta)
    p.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=p.parent, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)  # troca atômica: nunca deixa o arquivo pela metade


def status(pasta, d):
    linhas = [f"Projeto {d['projeto']} · perfil {d.get('perfil')}"]
    linhas += [f"  {e:9} {d['etapas'].get(e, '-')}" for e in ETAPAS]
    pend = [p for p in d.get("pendencias", []) if not p.get("resolvida")]
    linhas += [f"  pendência {p['id']} ({p['etapa']}): {p['texto']}" for p in pend]
    cv, mv = d.get("cortes", {}).get("versao"), d.get("mapa", {}).get("cortes_versao")
    if cv and mv and cv != mv:
        linhas.append(f"  ALERTA: corte v{cv} mais novo que o usado no mapa (v{mv}): recalcular cenas")
    cad = Path(pasta) / "edicao" / "aprendizados.md"
    n = cad.read_text(encoding="utf-8").count("- [ ]") if cad.exists() else 0
    linhas.append(f"  aprendizados anotados: {n}")
    return "\n".join(linhas)


def setar(d, chave, valor):
    if valor.startswith("@"):  # @arquivo.json: o PowerShell 5.1 come as aspas de JSON passado na linha de comando
        valor = Path(valor[1:]).read_text(encoding="utf-8-sig")  # -sig: o Set-Content do PowerShell grava BOM
    try:
        valor = json.loads(valor)
    except ValueError:
        pass
    alvo = d
    *partes, ultima = chave.split(".")
    for k in partes:
        alvo = alvo.setdefault(k, {})
    alvo[ultima] = valor


def main(a):
    pasta = a[0]
    if a[1] == "--init":
        if caminho(pasta).exists():
            sys.exit("projeto.json já existe: nada foi sobrescrito")
        gravar(pasta, {"projeto": a[2], "perfil": "caminho-livre",
                       "etapas": {e: "pendente" for e in ETAPAS}, "pendencias": []})
        print("criado"); return
    d = ler(pasta)
    if a[1] == "status":
        print(status(pasta, d)); return
    if a[1] == "--set":
        setar(d, a[2], a[3])
    elif a[1] == "--etapa":
        e, s = a[2].split("=")
        assert e in ETAPAS, f"etapa desconhecida: {e}"
        d["etapas"][e] = s
    elif a[1] == "--pendencia":
        pid = f"p{len(d['pendencias']) + 1:02d}"
        d["pendencias"].append({"id": pid, "etapa": a[2], "texto": a[3]})
        print(pid)
    elif a[1] == "--resolver":
        next(p for p in d["pendencias"] if p["id"] == a[2])["resolvida"] = True
    else:
        bloco = d.get(a[1])
        print(json.dumps(bloco, ensure_ascii=False, indent=1 if "--json" in a else None)[:4000]); return
    gravar(pasta, d)


def _teste():
    with tempfile.TemporaryDirectory() as t:
        main([t, "--init", "x"])
        main([t, "--etapa", "iniciar=concluido"])
        main([t, "--set", "roteiro.versao", "2"])
        main([t, "--pendencia", "cortes", "teste"])
        main([t, "--resolver", "p01"])
        d = ler(t)
        assert d["etapas"]["iniciar"] == "concluido" and d["roteiro"]["versao"] == 2
        assert d["pendencias"][0]["resolvida"] and "pendência" not in status(t, d)
    print("ok")


if __name__ == "__main__":
    _teste() if sys.argv[1:] == ["--teste"] else main(sys.argv[1:])
