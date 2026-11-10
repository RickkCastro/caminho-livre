# 📋 Backlog do produto — Caminho Livre

> Origem: quadro MoSCoW feito pela equipe (`Caminho livre.pdf`, 09/11). Os votos (👍) ajudaram na priorização.
> Notas duplicadas no quadro foram unificadas (indicado em "Origem").
> **Story points:** preencher na sessão de Planning Poker (escala Fibonacci: 1, 2, 3, 5, 8, 13).

## Atores
| Ator | Descrição |
|---|---|
| **Pedestre** | Usuário que circula a pé e quer rotas seguras |
| **Pessoa com mobilidade reduzida (PMR)** | Cadeirante, idoso, pessoa com carrinho de bebê |
| **Sistema** | Rotinas automáticas (expiração de alertas, cálculo de rota) |
| **Administrador** *(Won't)* | Acompanharia indicadores. Fica fora desta entrega, mas aparece no diagrama de casos de uso (escopo total) |

---

## 🟨 MUST: MVP

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US01** | Como **usuário**, quero **criar uma conta** para registrar e acompanhar meus alertas. | Criar conta | |
| **US02** | Como **usuário**, quero **fazer login** para acessar o app com meu perfil. | Login | |
| **US03** | Como **pedestre**, quero **enviar um alerta** (foto, categoria e local) para avisar outras pessoas sobre um problema na rua. | Enviar alertas (base do app) | |
| **US04** | Como **pedestre**, quero **ver no mapa os alertas** de degrau, buraco e rua escura para saber o que encontrarei no caminho. | Alertas de rotas | |
| **US05** | Como **pedestre**, quero **registrar e ver alertas de alagamento** para evitar ruas alagadas em dias de chuva. | Alerta de alagamento | |
| **US06** | Como **PMR**, quero **receber uma rota acessível que desvie dos alertas** para chegar ao destino sem barreiras. | Rotas acessíveis conforme alertas | |
| **US07** | Como **usuário com pouca familiaridade com tecnologia**, quero uma **interface acessível** (letras grandes, alto contraste, poucos passos) para conseguir usar o app sozinho. | Interface acessível | |

> 💡 **US07** é um requisito não funcional e vale para todas as telas. No PDF, troquem o texto da nota original por "pessoas com baixa familiaridade digital".

## 🟥 SHOULD

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US08** | Como **pedestre**, quero **confirmar ou negar (👍/👎) um alerta** de outro usuário para que o mapa seja confiável. | Avaliar avisos + Confirmação de alerta *(unificadas)* | |
| **US09** | Como **sistema**, quero **expirar alertas que não forem confirmados** dentro do prazo para o mapa não ficar desatualizado. | Validade de alertas sem confirmação | |
| **US10** | Como **pedestre**, quero **ver o detalhe de uma ocorrência** (foto, descrição, data e confirmações). | Detalhe da ocorrência | |
| **US11** | Como **usuário**, quero **ver o histórico das minhas ocorrências** para acompanhar o que reportei. | Minhas ocorrências (histórico) | |
| **US12** | Como **usuário**, quero **escolher quais tipos de alerta a rota deve considerar** para adaptá-la à minha necessidade. | Personalizar rota | |
| **US13** | Como **novo usuário**, quero um **onboarding que pergunte meu perfil** (pedestre ou PMR) para o app já sugerir rotas adequadas. | Onboarding com perfil | |
| **US14** | Como **usuário**, quero **personalizar meu perfil** (foto e nome). | Personalizar perfil | |
| **US15** | Como **pedestre**, quero **ver o ranking dos melhores e piores bairros** para entender a situação da minha região. | Ranking melhores e piores bairros | |

## 🟪 COULD

| ID | História | Origem no quadro | SP |
|---|---|---|---|
| **US16** | Como **usuário**, quero **favoritar rotas** e acessá-las em uma aba própria. | Favoritar rota + aba de rotas seguras favoritas *(unificadas)* | |
| **US17** | Como **usuário**, quero **ganhar pontos ao enviar um alerta** para me sentir motivado a contribuir. | Pontuar ao enviar alerta | |
| **US18** | Como **usuário**, quero **ganhar pontos ao confirmar um alerta**. | Pontuar ao confirmar alerta | |
| **US19** | Como **usuário**, quero **ver o ranking dos que mais contribuíram**. | Ranking dos que mais contribuíram + Ranks de usuários *(unificadas)* | |
| **US20** | Como **pedestre**, quero **compartilhar meu trajeto em tempo real** com um contato (estilo Uber). | Acompanhar trajeto | |

## 🟩 WON'T (fora desta entrega)

| ID | História | Origem no quadro |
|---|---|---|
| **US21** | Como **administrador**, quero um **painel de indicadores**. | Painel de indicadores (admin) |
| **US22** | Como **usuário**, quero **me conectar com outros usuários**. | Conexão entre usuários |

---

## 🎯 Escopo do MVP

**MVP = US01 a US07 (Must)**: conta, login, enviar alerta, ver alertas no mapa, alagamento, rota acessível e interface acessível.

**Recomendado para a demo do pitch (se der tempo):** US08 (confirmar 👍/👎), US09 (validade) e US10 (detalhe). Eles mostram o diferencial "dado confiável e atualizado" e já estão previstos no banco e na API.

## 🔗 Rastreabilidade (história → endpoint → tabela)

| História | Endpoint | Tabela |
|---|---|---|
| US01 | `POST /usuarios` | USUARIO |
| US02 | `POST /auth/login` | USUARIO |
| US03, US05 | `POST /ocorrencias` | OCORRENCIA, LOCALIZACAO, CATEGORIA_OCORRENCIA |
| US04 | `GET /ocorrencias?tipo=&status=` | OCORRENCIA |
| US06, US12 | `GET /trechos/pesos?idUsuario=&hora=` + Python | TRECHO, PREFERENCIA_ROTA |
| US08 | `POST /ocorrencias/{id}/confirmacoes` | CONFIRMACAO |
| US09 | rotina de expiração (BO) | OCORRENCIA |
| US10 | `GET /ocorrencias/{id}` | OCORRENCIA, CONFIRMACAO |
| US11 | `GET /usuarios/{id}/ocorrencias` | OCORRENCIA |
| US12 | `GET/PUT /usuarios/{id}/preferencias` | PREFERENCIA_ROTA |
| US13, US14 | `PUT /usuarios/{id}` | USUARIO |
| US15 | `GET /ranking/bairros` | OCORRENCIA, LOCALIZACAO |
| US16 | `GET/POST/DELETE /rotas-favoritas` | ROTA_FAVORITA |
| US17–US19 | `GET /ranking/usuarios` | USUARIO (pontos) |
