# ✅ Checklist da entrega — GS 2026.2 · Caminho Livre

**Prazo:** quinta, **19/11/2026 às 23h55**. Uma pessoa da equipe envia por disciplina.
Base: rubricas do [PDF da GS](GS%20CitizenTech%20-%202ES%20Fev%20-%20FIAP%202026.pdf). Situação em 17/11.

| Disciplina | Situação | Onde enviar | O que vai |
|---|---|---|---|
| Agile | 🟡 faltam protótipo e pitch | Teams | **1 PDF** com o link do pitch |
| AR-VR | 🔴 não começou | Teams | PDF com nomes + link do vídeo |
| Data Science | 🟢 só enviar | Teams | ZIP (ipynb + TXT + CSV) |
| Database | 🟢 só conferir e enviar | Teams | PDF + 3 arquivos `.sql` |
| DDD Java | 🟡 falta o PDF e o deploy atualizado | **Portal do Aluno** | ZIP (PDF + link do GitHub + link do deploy) |
| Dynamic Programming | 🟢 só enviar | Teams | ZIP (código + README) |
| Network | 🟢 só conferir e enviar | Teams ou Portal | `.pkt` + PDF |

---

## 🧭 Agile Methodology With Squad Framework
Entrega: **um único PDF**. Mais de um PDF ou link externo custa -10 pts. O vídeo precisa abrir pelo link, senão o item vale 0.

- [x] 1. Apresentação da ideia (10)
- [x] 2. Personas (10)
- [x] 3. Diagrama de casos de uso, exportado como imagem (20)
- [x] 4. Backlog com MoSCoW, story points (Planning Poker) e MVP destacado (20)
- [ ] **5. Protótipo de no mínimo 3 telas, com comentários de UX (20)**: prints das telas do `front-next/` (login/onboarding, mapa, enviar alerta, rota) e, para cada tela, a intenção e a adequação da UX (contraste, fonte grande, poucos toques, linguagem simples)
- [ ] **6. Vídeo pitch de até 3 min (20)**: narrado pela equipe, no YouTube como **não listado**, com o link no PDF. O mesmo vídeo serve para Testing
- [ ] Acrescentar as seções "Protótipo" e "Pitch" em `agile/Agile_GS_CaminhoLivre.md` e gerar o PDF de novo (`cd agile/pdf && node build.js`)
- [ ] Conferir se o PDF tem todos os integrantes e se o link do vídeo abre numa aba anônima

## 🥽 AR-VR Modelling And Simulation
- [ ] **Vídeo de 30 a 60 s** com o tema "CitizenTech", publicado no YouTube (roteiro em [`ar-vr/README.md`](../ar-vr/README.md))
- [ ] **PDF** com os nomes de todos os integrantes e o **link** do vídeo
- [ ] Conferir a duração (nem menos de 30 s, nem mais de 60 s) e se o link abre

## 📊 Data Science & Statistical Computing
- [x] Notebook executado: preparação, treino e teste sem vazamento, regressão linear (MAE, RMSE, R²) e logística (matriz de confusão, precisão, recall, F1), visualizações e recomendações
- [x] `integrantes.txt` com nomes e RMs
- [x] Bases com a fonte indicada (`dados/README.md`)
- [ ] Gerar o ZIP: `cd data-science && python gerar_zip_entrega.py` (sai em `data-science/entrega/`)
- [ ] Abrir o ZIP e conferir: `.ipynb` com as saídas, `.txt` e os CSV descompactados
- [ ] Enviar no Teams (um envio por equipe)

## 🗄️ Database Design
- [x] 1. PDF com capa (integrantes em ordem alfabética, RM, equipe e solução), sumário, objetivo/escopo e funcionalidades (10)
- [x] 2. Diagrama do modelo lógico no Oracle Data Modeler, dentro do PDF (20)
- [x] 3. DDL: `scripts/01_create.sql` (20)
- [x] 4. DML com no mínimo 5 linhas por tabela: `scripts/02_insert.sql` (20)
- [x] 5. DQL com A1 INNER JOIN, A2 INNER JOIN + GROUP BY e A3 LEFT JOIN + WHERE + ORDER BY: `scripts/03_consultas.sql` (30)
- [ ] **Rodar os 3 scripts no Oracle da FIAP** e confirmar que as consultas A1–A3 retornam dados
- [ ] Enviar no Teams: `Database_GS_CaminhoLivre.pdf` + os três `.sql` como arquivos soltos, **sem links de diagrama na nuvem**

## ☕ Domain Driven Design – Java
Entrega: **ZIP no Portal do Aluno**. ⚠️ Um commit depois do prazo **zera a parte técnica**.

Parte técnica (70):
- [x] Model, DAO/BO (repository/service), Controller com GET/POST/PUT/DELETE, tratamento de exceções
- [x] Deploy no Render: https://caminho-livre.onrender.com
- [ ] **Atualizar a branch `java`**, que é a que o Render publica, com a API da `main`: hoje faltam 8 arquivos (rota por ruas reais, ranking, erros, testes). Fazer isso **antes de 19/11 às 23h55** e conferir se o deploy subiu (`/categorias` responde 200)

Documentação, PDF único (30):
- [ ] Capa (nome do projeto, nomes completos e RMs), índice, descrição, justificativa e objetivos (5)
- [ ] Diagrama de classes que reflita o código, a partir de [`docs/diagrama-classes.md`](../api-java/caminholivre-backend/docs/diagrama-classes.md) (10)
- [ ] Protótipos das telas do front + tabela de endpoints (GET/POST/PUT/DELETE) + DER, que pode reaproveitar `database/modelos/Relational_1.png` (10)
- [ ] Instruções de execução: ferramentas, versões (JDK 21, Oracle), links do GitHub e do deploy, passo a passo (5)
- [ ] Montar o ZIP: PDF + link do GitHub + link do deploy

## 🧮 Dynamic Programming
- [x] Código com grafos, memoização e tabulação, mais testes e exemplos
- [x] README com nomes, RMs, descrição dos algoritmos e das funcionalidades
- [ ] Rodar os testes uma vez (`cd dynamic-programming && python -m unittest discover -s tests -v`, 44 testes)
- [ ] Gerar o ZIP único (seção 11 do [README](../dynamic-programming/README.md)) e enviar no Teams

## 🌐 Network Architect Solutions
- [x] `.pkt` com VLANs por setor, router-on-a-stick, DHCP, NAT/PAT, servidor com DNS e HTTP (Ficha), ACL estendida, SSH com enable secret e Wi-Fi WPA2
- [x] PDF com a Ficha, topologia, endereçamento, trechos de `show running-config` e prints dos testes
- [ ] **Confirmar o número da equipe**: a rubrica pede `192.168.X.0/24` com X = número da equipe, e o projeto usa **X = 10**. Se não for 10, ajustar ou explicar no PDF
- [ ] A rubrica pede "um pool DHCP por VLAN", e hoje só há pools de Cidadão e Equipe. Citar no PDF que Servidores e Gerência usam IP fixo de propósito
- [ ] Enviar o `.pkt` e o PDF (um envio por equipe)

---

## 🔁 Itens gerais
- [ ] **`prompts.md`** na raiz do repositório, com os prompts de IA usados, como pedem os combinados da equipe
- [ ] **Pitch de Testing**: vídeo de até 3 min no YouTube, com o link enviado (pode ser o mesmo do Agile)
- [ ] Fazer push da `development` e o merge na `main` antes do prazo
- [ ] Ficha da CitizenTech no topo do README da raiz: ✔️ já está lá
- [ ] Nenhum dado pessoal real no repositório: ✔️ a carga usa usuários fictícios
- [ ] **Depois de 19/11 às 23h55, nenhum commit**, principalmente na branch `java`
