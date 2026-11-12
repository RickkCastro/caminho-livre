# Feature Specification: Front-end web Caminho Livre (Next.js)

**Feature Branch**: `002-front-next-web`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Interface web acessível, mobile first, que consome a API Java do Caminho Livre: login Google, mapa de alertas com filtros, envio de alerta, rota acessível comparada, detalhe/avaliação, perfil/onboarding, histórico, ranking e exclusão de conta — conforme agile/backlog.md."

## Clarifications

### Session 2026-11-12

- Q: Onde a foto do alerta é guardada? → A: Vercel Blob; o front envia a imagem e manda a URL pública para a API.
- Q: Como o usuário informa origem e destino na rota? → A: Origem = localização atual (pode trocar); destino por busca de endereço ou toque no mapa.
- Q: Quem não fez login pode ver o mapa e pedir rota? → A: Sim; mapa, detalhe e rota são abertos; login só para enviar/avaliar alerta, perfil e histórico.
- Q: Por quanto tempo o usuário fica logado no aparelho? → A: Até tocar "Sair"; o token do Google é renovado automaticamente ao expirar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar e sair (Priority: P1) — US01, US06

Usuário toca em "Entrar com Google", volta logado com nome e foto; em "Sair" a sessão do aparelho é apagada.

**Why this priority**: Pré-requisito para enviar e avaliar alertas.

**Independent Test**: login com conta Google de teste mostra nome/foto no topo; "Sair" volta à tela de login e recarregar não restaura a sessão.

**Acceptance Scenarios**:

1. **Given** não logado, **When** toca "Entrar com Google" e autoriza, **Then** vê o mapa com seu nome e foto.
2. **Given** é o primeiro acesso, **When** entra, **Then** vê o onboarding (US12) antes do mapa.
3. **Given** logado, **When** toca "Sair", **Then** volta para `/login` e nenhum dado pessoal permanece no navegador.
4. **Given** o login falha, **When** volta do Google, **Then** vê mensagem simples "Não foi possível entrar. Tente de novo." com botão.

---

### User Story 2 - Ver alertas no mapa (Priority: P1) — US03

Tela inicial `/` mostra mapa OpenStreetMap centrado na posição do usuário, com alertas ativos por cor **e** forma de ícone, e filtros Acessibilidade / Segurança / Alagamento.

**Why this priority**: É o primeiro valor que o usuário percebe.

**Independent Test**: com mocks ou API, o mapa carrega os alertas e os filtros ocultam/mostram cada tipo.

**Acceptance Scenarios**:

1. **Given** alertas ativos, **When** abre `/`, **Then** vê os marcadores em ≤ 3 s em 4G, cada um com ícone e rótulo de tipo.
2. **Given** desmarca "Segurança", **When** o filtro muda, **Then** somente alertas de segurança somem.
3. **Given** a localização foi negada, **When** abre o mapa, **Then** o mapa abre no centro de São Paulo com aviso em texto.
4. **Given** toca num marcador, **When** abre o resumo, **Then** pode ir ao detalhe (US09).

---

### User Story 3 - Enviar alerta em até 4 toques (Priority: P1) — US02

Fluxo `/ocorrencias/nova`: foto (opcional) → categoria → local (GPS ou toque no mapa) → enviar.

**Why this priority**: Gera o dado do produto; requisito de usabilidade RNF03.

**Independent Test**: usuário completa o envio em ≤ 4 toques e vê o novo alerta no mapa.

**Acceptance Scenarios**:

1. **Given** logado e GPS permitido, **When** toca "Avisar problema" → categoria → "Usar minha localização" → "Enviar", **Then** vê "Alerta enviado" e o marcador aparece no mapa.
2. **Given** não escolheu categoria, **When** tenta enviar, **Then** o botão fica desabilitado com texto explicando o que falta.
3. **Given** sem GPS, **When** chega ao passo local, **Then** pode tocar no mapa para marcar.
4. **Given** a API responde erro, **When** envia, **Then** vê a mensagem do campo `erro` e os dados preenchidos são mantidos.

---

### User Story 4 - Rota acessível comparada (Priority: P1) — US04, US11

Tela `/rota`: origem e destino; mostra rota comum e rota Caminho Livre lado a lado com distância de cada uma.

**Why this priority**: Diferencial do produto, centro do pitch.

**Independent Test**: informar origem/destino conhecidos exibe duas linhas no mapa com cores e legendas diferentes e as distâncias.

**Acceptance Scenarios**:

0. **Given** GPS permitido, **When** abre `/rota`, **Then** a origem já vem preenchida com "Minha localização" e pode ser trocada; o destino é escolhido pela busca de endereço ou tocando no mapa.
1. **Given** origem e destino, **When** toca "Ver caminho", **Then** em ≤ 5 s vê as duas rotas, legenda em texto e as distâncias.
2. **Given** usuário com mobilidade reduzida, **When** pede a rota, **Then** a rota Caminho Livre não passa por trechos bloqueados e há aviso se não existir caminho possível.
3. **Given** usuário desligou categorias em "Ajustar rota", **When** pede a rota, **Then** o cálculo usa essas preferências.

---

### User Story 5 - Interface acessível (Priority: P1) — US05

Transversal a todas as telas.

**Independent Test**: auditoria Lighthouse/axe em todas as telas sem erros de contraste, rótulo ou alvo de toque; navegação completa só por teclado.

**Acceptance Scenarios**:

1. **Given** qualquer tela, **When** auditada, **Then** contraste ≥ 4,5:1, imagens/ícones com texto alternativo, fonte base ≥ 16 px, alvos ≥ 48×48 px.
2. **Given** fonte do sistema em 200%, **When** usa o app, **Then** nada fica cortado nem sobreposto.
3. **Given** qualquer botão, **When** exibido, **Then** tem ícone **e** texto em linguagem simples.

---

### User Story 6 - Detalhe e avaliação 👍/👎 (Priority: P2) — US07, US09

`/ocorrencias/[id]`: foto, descrição, categoria, data, status, totais 👍/👎 e botões "Ainda está lá" / "Já foi resolvido".

**Acceptance Scenarios**:

1. **Given** alerta de outra pessoa, **When** toca 👍, **Then** o total aumenta e os botões ficam desabilitados com texto "Você já avaliou".
2. **Given** alerta próprio, **When** abre o detalhe, **Then** não vê botões de avaliação.
3. **Given** o autor do alerta, **When** qualquer um vê o detalhe, **Then** o nome do autor não aparece.

---

### User Story 7 - Onboarding e perfil (Priority: P2) — US12, US13

`/perfil`: nome, foto e "Tenho mobilidade reduzida" (sim/não), editáveis; onboarding pergunta isso no primeiro acesso.

**Acceptance Scenarios**:

1. **Given** primeiro acesso, **When** responde a pergunta de mobilidade, **Then** vai ao mapa e a resposta fica salva.
2. **Given** perfil aberto, **When** altera nome/foto e salva, **Then** o topo mostra os novos dados.

---

### User Story 8 - Minhas ocorrências e ajustes de rota (Priority: P2) — US10, US11

`/minhas` lista meus alertas com status em texto; "Ajustar rota" liga/desliga categorias.

**Acceptance Scenarios**:

1. **Given** enviei alertas, **When** abro `/minhas`, **Then** vejo cada um com categoria, data, status e totais.
2. **Given** desligo "Rua escura", **When** salvo, **Then** a preferência persiste após recarregar.

---

### User Story 9 - Ranking de bairros (Priority: P2) — US14

`/ranking` mostra melhores e piores bairros em lista (não só gráfico).

**Acceptance Scenarios**:

1. **When** abre `/ranking`, **Then** vê duas listas ordenadas com posição, bairro e número de alertas ativos.

---

### User Story 10 - Excluir conta (Priority: P2) — US15

**Acceptance Scenarios**:

1. **Given** no perfil, **When** toca "Excluir minha conta", **Then** vê confirmação explicando o que será apagado e que os alertas ficam anônimos.
2. **When** confirma, **Then** a conta é excluída, a sessão é apagada e volta ao login.

---

### User Story 11 - Pontos, ranking de usuários e rotas favoritas (Priority: P3) — US16–US19

**Acceptance Scenarios**:

1. **When** envia ou avalia um alerta, **Then** vê os pontos ganhos (+10 / +2) e o total no perfil.
2. **When** salva uma rota com apelido, **Then** ela aparece na aba "Favoritas" e pode ser aberta ou removida.

### Edge Cases

- Sem internet: mostrar aviso em texto e manter o último mapa carregado; não perder o formulário de alerta.
- API fora do ar (Render dormindo): mostrar "Carregando…" com até 60 s antes do erro; em desenvolvimento usar mocks em `src/mocks/` no mesmo formato da API.
- Token do Google expirado (401): renovar em silêncio e repetir a chamada; só se a renovação falhar, ir ao login preservando a tela e os dados do formulário.
- Envio de foto sem login: o upload é recusado (só usuário logado gera token de upload).
- Foto grande: reduzir no navegador (lado maior ≤ 1280 px, JPEG) antes de enviar; aceitar só imagem.
- Falha no envio da foto: avisar e permitir enviar o alerta sem foto.
- Busca de endereço sem resultado ou indisponível: mostrar "Endereço não encontrado. Toque no mapa para marcar."
- Destino fora da área mapeada (API responde 422): mostrar a mensagem do campo `erro`.
- Visitante no detalhe do alerta: botões 👍/👎 aparecem com o texto "Entre para avaliar".
- Sem alertas na região: texto "Nenhum problema avisado por aqui".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001a**: Mapa (`/`), detalhe do alerta e rota DEVEM funcionar sem login. Enviar alerta, avaliar, perfil, histórico, preferências e favoritas DEVEM exigir login; ao tocar nessas ações sem login, o usuário vai para `/login` e volta à ação depois de entrar. Na rota, o visitante pode marcar "Tenho mobilidade reduzida" só para aquela consulta (não é salvo).
- **FR-001** (RF01–RF03): DEVE oferecer login via Google, enviar o ID token para `POST /auth/google` e permitir sair apagando a sessão local. A sessão DEVE durar até o usuário tocar "Sair", com renovação automática do token do Google.
- **FR-002** (RF07, RF08): DEVE exibir alertas ativos no mapa com cor + forma + rótulo por tipo e filtros por tipo.
- **FR-003** (RF04–RF06, RNF03): DEVE permitir enviar alerta com categoria e local obrigatórios, foto e descrição opcionais, em até 4 toques.
- **FR-004** (RF09–RF11): DEVE mostrar rota comum e rota Caminho Livre lado a lado com distâncias.
- **FR-005** (RF12, RF15): DEVE exibir detalhe do alerta e permitir 👍/👎 uma vez, sem autoavaliação.
- **FR-006** (RF16–RF19): DEVE oferecer onboarding de mobilidade, edição de perfil, histórico e preferências de rota.
- **FR-007** (RF20): DEVE exibir ranking de bairros em lista acessível.
- **FR-008** (RF21): DEVE permitir excluir a conta com confirmação explícita.
- **FR-009** (RNF01, RNF02, RNF04): Toda tela DEVE cumprir WCAG 2.1 AA, fonte ≥ 16 px, alvos ≥ 48 px, ícone + texto, linguagem simples.
- **FR-010** (RNF05): DEVE ser responsivo, mobile first, funcionando em Chrome, Safari e Edge atuais.
- **FR-011** (RNF08): NÃO DEVE exibir quem enviou um alerta.
- **FR-012** (Princípio V): DEVE consumir apenas os endpoints do contrato da API Caminho Livre em `api-java/README.md` (além dos serviços externos Nominatim, para busca de endereço, e Vercel Blob, para fotos), com URL em `NEXT_PUBLIC_API_URL`, e mostrar o campo `erro` das respostas de erro.
- **FR-013** (RF22–RF24, Could): DEVE mostrar pontos, ranking de usuários e aba de rotas favoritas.
- **FR-014** (identidade visual): A interface DEVE usar as cores da marca, mais as cores de estado (tipos de alerta e erro) definidas no research, respeitando o contraste do RNF01:
  - **Verde-escuro `#2A4B25`**: textos, ícones, botões principais (com texto branco) e a linha da rota Caminho Livre. Contraste com branco 9,85:1 (AAA).
  - **Branco `#FFFFFF`**: fundo das telas e texto sobre verde-escuro.
  - **Verde-água `#76C1A9`**: fundos de destaque (cabeçalho, cartões, chip de filtro ativo) **sempre com texto verde-escuro** (4,68:1, AA). É PROIBIDO texto branco sobre verde-água (2,11:1) e usar verde-água sozinho como borda, ícone ou linha sobre branco (abaixo de 3:1); nesses casos acompanhar de contorno verde-escuro.
  - Cores de estado dos alertas (Acessibilidade, Segurança, Clima) e de erro são complementares, distinguidas também por forma e rótulo, e precisam de ≥ 3:1 contra o fundo do mapa.

### Key Entities

- **Sessão**: usuário logado (id, nome, foto, mobilidadeReduzida) + ID token Google; vive só no aparelho.
- **Alerta (Ocorrência)**: id, categoria/tipo, coordenadas, foto, descrição, status, data, totais 👍/👎.
- **Rota**: origem, destino, linha comum, linha Caminho Livre, distâncias.
- **Preferências**: categorias consideradas na rota.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Mapa com alertas visível em ≤ 3 s e rota em ≤ 5 s em 4G simulado.
- **SC-002**: Enviar alerta em ≤ 4 toques a partir do mapa.
- **SC-003**: Lighthouse Acessibilidade ≥ 95 em todas as telas e zero violações críticas no axe.
- **SC-004**: Em teste com 3 pessoas pouco familiarizadas com tecnologia, todas enviam um alerta sozinhas na primeira tentativa.
- **SC-005**: Deploy na Vercel funcionando com a API do Render antes da integração de 18/11.
- **SC-006**: 100% dos pares texto/fundo usam uma combinação aprovada no FR-014 (nenhum texto branco sobre `#76C1A9`).

## Assumptions

- Login com Google Identity Services no navegador; a API valida o token (sem JWT próprio).
- Rota calculada pela API Java em `GET /rotas`; o front envia origem, destino, hora, `mobilidadeReduzida` e as categorias desligadas (`ignorar`, lidas de `GET /usuarios/{id}/preferencias`) e só desenha o resultado. O Python (Dynamic Programming) é entrega isolada.
- Upload de foto para o Vercel Blob (plano gratuito), que devolve a URL pública enviada à API em `fotoUrl`.
- Mapa: Leaflet + OpenStreetMap; busca de endereço via Nominatim.
- Paleta da marca definida pela equipe em 2026-11-12: `#76C1A9`, `#FFFFFF`, `#2A4B25`. Contrastes calculados pela fórmula WCAG 2.1.
- Painel do administrador (US21), conexão entre usuários (US22) e trajeto em tempo real (US20) ficam fora.
