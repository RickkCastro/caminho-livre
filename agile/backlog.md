# 📋 Backlog do produto — Caminho Livre

> Origem: quadro MoSCoW feito pela equipe (`Caminho livre.pdf`, 09/11). Os votos (👍) ajudaram na priorização.
> Notas duplicadas no quadro foram unificadas (indicado em "Origem").
> **Story points:** estimados por Planning Poker (escala Fibonacci: 1, 2, 3, 5, 8, 13), com a US06 (sair da conta) como referência de 1 ponto. Total: 81 SP (Must 32, Should 25, Could 24).

## Atores
| Ator | Tipo | Descrição |
|---|---|---|
| **Usuário** | Principal | Qualquer pessoa que circula a pé: quem volta à noite, idosos, cadeirantes, pais com carrinho de bebê. No perfil, informa se tem mobilidade reduzida. |
| **Sistema** | Secundário | Rotinas automáticas (cálculo de rota, expiração de alertas) |
| **Google** | Externo | Autentica o usuário (login social) |
| **Administrador** *(Won't)* | Principal | Acompanharia indicadores. Fica fora desta entrega, mas aparece no diagrama de casos de uso (escopo total) |

---

## 🟨 MUST: MVP

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US01** | Como **usuário**, quero **entrar com a minha conta Google** para acessar o app sem precisar criar e lembrar uma senha. | Criar conta + Login *(unificadas)* | 5 |
| **US02** | Como **usuário**, quero **enviar um alerta** com foto, categoria (degrau, buraco, calçada quebrada, rua escura, **alagamento** etc.) e local para avisar outras pessoas sobre um problema na rua. | Enviar alertas + Alerta de alagamento *(unificadas)* | 5 |
| **US03** | Como **usuário**, quero **ver os alertas no mapa**, filtrando por tipo (acessibilidade, segurança e alagamento), para saber o que vou encontrar no caminho. | Alertas de rotas | 5 |
| **US04** | Como **usuário**, quero **receber uma rota acessível que desvie dos alertas** para chegar ao destino sem barreiras. | Rotas acessíveis conforme alertas | 13 |
| **US05** | Como **usuário com pouca familiaridade com tecnologia**, quero uma **interface acessível** (letras grandes, alto contraste, poucos passos) para conseguir usar o app sozinho. | Interface acessível | 3 |
| **US06** | Como **usuário**, quero **sair da minha conta** para que outra pessoa que use o mesmo celular não acesse meu perfil. | — *(nova, complementa o login)* | 1 |

## 🟥 SHOULD

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US07** | Como **usuário**, quero **confirmar ou negar (👍/👎) um alerta** de outra pessoa para que o mapa seja confiável. | Avaliar avisos + Confirmação de alerta *(unificadas)* | 3 |
| **US08** | Como **usuário**, quero que **alertas sem confirmação expirem** depois de um prazo para que o mapa não mostre problemas que já não existem. | Validade de alertas sem confirmação | 3 |
| **US09** | Como **usuário**, quero **ver o detalhe de um alerta** (foto, descrição, data e confirmações). | Detalhe da ocorrência | 2 |
| **US10** | Como **usuário**, quero **ver o histórico dos meus alertas** para acompanhar o que reportei. | Minhas ocorrências (histórico) | 2 |
| **US11** | Como **usuário**, quero **escolher quais tipos de alerta a rota deve considerar** para adaptá-la à minha necessidade. | Personalizar rota | 3 |
| **US12** | Como **novo usuário**, quero um **onboarding que pergunte se tenho mobilidade reduzida** para o app já sugerir rotas adequadas. | Onboarding com perfil | 2 |
| **US13** | Como **usuário**, quero **personalizar meu perfil** (foto e nome). | Personalizar perfil | 2 |
| **US14** | Como **usuário**, quero **ver o ranking dos melhores e piores bairros** para entender a situação da minha região. | Ranking melhores e piores bairros | 5 |
| **US15** | Como **usuário**, quero **excluir minha conta e meus dados pessoais** para deixar de usar o app com a garantia de que meus dados foram apagados (LGPD). | — *(nova, exigência da LGPD)* | 3 |

## 🟪 COULD

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US16** | Como **usuário**, quero **favoritar rotas** e acessá-las em uma aba própria. | Favoritar rota + aba de rotas seguras favoritas *(unificadas)* | 5 |
| **US17** | Como **usuário**, quero **ganhar pontos ao enviar um alerta** para me sentir motivado a contribuir. | Pontuar ao enviar alerta | 2 |
| **US18** | Como **usuário**, quero **ganhar pontos ao confirmar um alerta**. | Pontuar ao confirmar alerta | 1 |
| **US19** | Como **usuário**, quero **ver o ranking dos que mais contribuíram**. | Ranking dos que mais contribuíram + Ranks de usuários *(unificadas)* | 3 |
| **US20** | Como **usuário**, quero **compartilhar meu trajeto em tempo real** com um contato (estilo Uber). | Acompanhar trajeto | 13 |

## 🟩 WON'T (fora desta entrega)

| ID | História | Origem no quadro |
|---|---|---|
| **US21** | Como **administrador**, quero um **painel de indicadores**. | Painel de indicadores (admin) |
| **US22** | Como **usuário**, quero **me conectar com outros usuários**. | Conexão entre usuários |

---

## 🎯 Escopo do MVP

**MVP = US01 a US06 (Must)**: entrar com Google, sair da conta, enviar alerta (incluindo alagamento), ver alertas no mapa, rota acessível e interface acessível.

**Recomendado para a demo do pitch (se der tempo):** US07 (confirmar 👍/👎), US08 (validade) e US09 (detalhe). Eles mostram o diferencial "dado confiável e atualizado" e já estão previstos no banco e na API.

---

## ✅ Requisitos funcionais

| ID | Requisito | Prioridade | Histórias |
|---|---|---|---|
| **RF01** | O sistema deve permitir que o usuário entre com a conta Google (OAuth 2.0 / OpenID Connect). | Must | US01 |
| **RF02** | No primeiro login, o sistema deve criar o cadastro do usuário com nome, e-mail e foto vindos do Google. | Must | US01 |
| **RF03** | O sistema deve permitir que o usuário saia da conta (logout), encerrando a sessão no aparelho. | Must | US06 |
| **RF04** | O sistema deve permitir enviar um alerta com categoria (obrigatória), localização (obrigatória), foto e descrição (opcionais). | Must | US02 |
| **RF05** | O sistema deve oferecer as categorias de alerta agrupadas em Acessibilidade (degrau, falta de rampa, buraco, calçada quebrada, obra), Segurança (rua escura, local deserto, assalto) e Clima (alagamento). | Must | US02 |
| **RF06** | O sistema deve permitir marcar o local do alerta pela localização atual (GPS) ou tocando no mapa. | Must | US02 |
| **RF07** | O sistema deve exibir no mapa os alertas ativos, com cor e ícone por tipo. | Must | US03 |
| **RF08** | O sistema deve permitir filtrar os alertas do mapa por tipo (Acessibilidade, Segurança, Alagamento). | Must | US03 |
| **RF09** | O sistema deve calcular uma rota entre origem e destino que evite os trechos com alertas ativos, considerando o horário (peso maior à noite para alertas de segurança). | Must | US04 |
| **RF10** | Para usuários com mobilidade reduzida, o sistema deve tratar trechos com degrau ou sem rampa como intransponíveis. | Must | US04, US12 |
| **RF11** | O sistema deve mostrar a rota comum e a rota Caminho Livre lado a lado, com a distância de cada uma. | Must | US04 |
| **RF12** | O sistema deve permitir confirmar (👍) ou negar (👎) um alerta, uma única vez por usuário, sem avaliar o próprio alerta. | Should | US07 |
| **RF13** | O sistema deve mudar o alerta para `CONFIRMADA` com 3 confirmações e para `RESOLVIDA` com 3 negações (contagem total; as negações prevalecem). | Should | US07 |
| **RF14** | O sistema deve expirar automaticamente alertas não confirmados 15 dias após o registro. | Should | US08 |
| **RF15** | O sistema deve exibir o detalhe do alerta: foto, descrição, categoria, data, status e total de 👍/👎. | Should | US09 |
| **RF16** | O sistema deve listar os alertas enviados pelo usuário, com o status de cada um. | Should | US10 |
| **RF17** | O sistema deve permitir ligar e desligar as categorias de alerta consideradas no cálculo da rota. | Should | US11 |
| **RF18** | No primeiro acesso, o sistema deve perguntar se o usuário tem mobilidade reduzida e permitir alterar essa resposta depois. | Should | US12 |
| **RF19** | O sistema deve permitir alterar o nome e a foto do perfil. | Should | US13 |
| **RF20** | O sistema deve exibir o ranking dos bairros com mais e menos alertas ativos, ponderados pela gravidade. | Should | US14 |
| **RF21** | O sistema deve permitir que o usuário exclua a conta, após confirmação, apagando nome, e-mail, foto e preferências; os alertas enviados continuam no mapa, mas sem vínculo com a pessoa. | Should | US15 |
| **RF22** | O sistema deve permitir salvar, listar e remover rotas favoritas. | Could | US16 |
| **RF23** | O sistema deve somar pontos ao usuário: +10 ao enviar um alerta e +2 ao avaliar um alerta. | Could | US17, US18 |
| **RF24** | O sistema deve exibir o ranking dos usuários com mais pontos. | Could | US19 |
| **RF25** | O sistema deve permitir compartilhar o trajeto em tempo real com um contato por link. | Could | US20 |

## 🧱 Requisitos não funcionais

| ID | Categoria | Requisito | Histórias |
|---|---|---|---|
| **RNF01** | Usabilidade / acessibilidade | Seguir as diretrizes WCAG 2.1 nível AA: contraste mínimo de 4,5:1 e textos alternativos nas imagens e ícones. | US05 |
| **RNF02** | Usabilidade / acessibilidade | Fonte base de no mínimo 16 px, com suporte ao aumento de fonte do sistema, e áreas de toque de no mínimo 48 × 48 px. | US05 |
| **RNF03** | Usabilidade | Enviar um alerta em no máximo 4 toques após abrir o app (foto → categoria → local → enviar). | US02, US05 |
| **RNF04** | Usabilidade | Linguagem simples, sem termos técnicos, e ícone acompanhado de texto em todos os botões. | US05 |
| **RNF05** | Compatibilidade | Interface responsiva, priorizando celular (mobile first), funcionando nas versões atuais do Chrome, Safari e Edge. | US05 |
| **RNF06** | Segurança | Autenticação feita apenas pelo Google: o sistema não armazena senhas e valida o token do Google no back-end a cada login. | US01 |
| **RNF07** | Segurança | Toda comunicação entre front, API e Google deve usar HTTPS. | US01 |
| **RNF08** | Privacidade (LGPD) | Coletar apenas nome, e-mail e foto do Google; não exibir publicamente quem enviou um alerta; permitir que o usuário exclua a conta e os dados pessoais. | US01, US02, US15 |
| **RNF09** | Desempenho | Carregar o mapa com os alertas em até 3 segundos e calcular a rota em até 5 segundos em conexão 4G. | US03, US04 |
| **RNF10** | Confiabilidade dos dados | Alertas `EXPIRADA` e `RESOLVIDA` não aparecem no mapa nem entram no cálculo da rota. | US07, US08 |
| **RNF11** | Arquitetura | API REST em Java com banco Oracle, front em Next.js e cálculo de rota na própria API Java (ruas reais via OpenRouteService, Brasil inteiro), publicados em nuvem (Render/Vercel). | Todas |
| **RNF12** | Manutenibilidade | Código versionado no GitHub, com a API organizada em camadas (model, DAO, BO, controller). | Todas |

---

## 🔗 Rastreabilidade (história → requisito → endpoint → tabela)

| História | Requisitos | Endpoint | Tabela |
|---|---|---|---|
| US01 | RF01, RF02, RNF06–RNF08 | `POST /auth/google` | USUARIO |
| US02 | RF04–RF06, RNF03 | `POST /ocorrencias` | OCORRENCIA, LOCALIZACAO, CATEGORIA_OCORRENCIA |
| US03 | RF07, RF08, RNF09 | `GET /ocorrencias?tipo=&status=` | OCORRENCIA |
| US04 | RF09–RF11, RNF09 | `GET /rotas` (OpenRouteService via API) | TRECHO, LOCALIZACAO, PREFERENCIA_ROTA |
| US05 | RNF01–RNF05 | todas as telas | — |
| US06 | RF03 | logout no front (descarta a sessão) | — |
| US07 | RF12, RF13 | `POST /ocorrencias/{id}/confirmacoes` | CONFIRMACAO |
| US08 | RF14, RNF10 | rotina de expiração (BO) | OCORRENCIA |
| US09 | RF15 | `GET /ocorrencias/{id}` | OCORRENCIA, CONFIRMACAO |
| US10 | RF16 | `GET /usuarios/{id}/ocorrencias` | OCORRENCIA |
| US11 | RF17 | `GET/PUT /usuarios/{id}/preferencias` | PREFERENCIA_ROTA |
| US12, US13 | RF18, RF19 | `PUT /usuarios/{id}` | USUARIO |
| US14 | RF20 | `GET /ranking/bairros` | OCORRENCIA, LOCALIZACAO |
| US15 | RF21, RNF08 | `DELETE /usuarios/{id}` | USUARIO, PREFERENCIA_ROTA, OCORRENCIA (anonimiza) |
| US16 | RF22 | `GET/POST/DELETE /rotas-favoritas` | ROTA_FAVORITA |
| US17–US19 | RF23, RF24 | `GET /ranking/usuarios` | USUARIO (pontos) |
