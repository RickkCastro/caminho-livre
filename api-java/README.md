# ☕ Domain Driven Design — Java — Ulisses

**Disciplina:** Domain Driven Design – Java · **Entrega:** `.zip` no **Portal do Aluno** até 19/11, 23h55

## Conceito
API RESTful em **Spring Boot** com banco **Oracle (FIAP)**, implementando o núcleo do Caminho Livre: ocorrências, confirmações, expiração e pesos dos trechos.

## Entregáveis
O `.zip` contém o **PDF da documentação**, o **link do GitHub** e o **link do deploy**.

### Documentação: PDF único (30 pts)
- [ ] Especificação (5): capa com nome do projeto, nomes completos e RMs, índice, descrição, justificativa e objetivos
- [ ] Diagrama de classes refletindo o código (10)
- [ ] Protótipos de tela + tabela de endpoints (GET/POST/PUT/DELETE) + DER (10)
- [ ] Instruções de execução (5): ferramentas, versões (JDK 21, Oracle), links do GitHub e do deploy, passo a passo

### Parte técnica (70 pts)
- [ ] Camada **model** com as classes de acordo com o banco (10)
- [ ] Camadas **DAO** e **BO** (10)
- [ ] **Controller** com GET, POST, PUT e DELETE (10)
- [ ] **Tratamento de exceções** (10)
- [ ] **Deploy no Render** (30) ⚠️ *fazer até 15/11*

> ⚠️ Commits feitos após a data de entrega **zeram toda a parte técnica**.

## Estrutura sugerida
```
src/main/java/br/com/fiap/caminholivre/
├── model/        Usuario, CategoriaOcorrencia, Localizacao, Ocorrencia, Confirmacao, Trecho, RotaSalva, ContatoConfianca
├── dao/          um DAO por entidade
├── bo/           regras de negócio (confirmar, expirar, resolver, calcular peso)
├── controller/   endpoints REST
├── exception/    @ControllerAdvice, RecursoNaoEncontradoException, RegraNegocioException
└── config/       conexão Oracle, CORS para o front
```

## Regras de negócio (BO)
Alinhadas ao [backlog MoSCoW](../agile/backlog.md):
- Uma ocorrência nasce `ABERTA`, com `dt_expiracao` = registro + 15 dias (US09).
- Com **3 confirmações positivas (👍)** ela passa para `CONFIRMADA` (US08).
- Com **3 negações (👎)** ela passa para `RESOLVIDA` ("o problema não existe mais"). Não há painel de gestor (US21 é Won't).
- Um usuário só avalia uma vez cada ocorrência e não avalia a própria.
- Ocorrências vencidas e não confirmadas passam para `EXPIRADA` (US09).
- O peso do trecho é `distância × (1 + Σ pesos das ocorrências ativas próximas)`, usando `peso_noturno` entre 19h e 6h, ignorando as categorias que o usuário desligou em `PREFERENCIA_ROTA` (US12). Para o perfil `MOBILIDADE_REDUZIDA`, um degrau bloqueia o trecho.
- *(Could)* +10 pontos ao enviar um alerta e +2 ao avaliar (US17, US18).
- Login simples: `POST /auth/login` valida email + senha (hash) e devolve os dados do usuário. JWT é opcional.

## Tabela de endpoints (contrato com o front)
| Método | Rota | Descrição | História |
|---|---|---|---|
| POST | `/auth/login` | Login | US02 |
| GET / POST | `/usuarios` | Listar / criar conta | US01 |
| GET / PUT / DELETE | `/usuarios/{id}` | Buscar / atualizar perfil (nome, foto, perfil) / remover | US13, US14 |
| GET | `/usuarios/{id}/ocorrencias` | Minhas ocorrências | US11 |
| GET / PUT | `/usuarios/{id}/preferencias` | Categorias que a rota considera | US12 |
| GET / POST | `/categorias` | Listar / cadastrar | US03–05 |
| GET / PUT / DELETE | `/categorias/{id}` | | |
| GET / POST | `/localizacoes` | | |
| GET / PUT / DELETE | `/localizacoes/{id}` | | |
| GET | `/ocorrencias?bairro=&tipo=&status=` | Listar com filtros (mapa) | US04 |
| POST | `/ocorrencias` | Enviar alerta (inclui alagamento) | US03, US05 |
| GET / PUT / DELETE | `/ocorrencias/{id}` | Detalhe / editar / remover | US10 |
| POST | `/ocorrencias/{id}/confirmacoes` | Avaliar 👍/👎 | US08 |
| GET / POST | `/trechos` | | |
| GET / PUT / DELETE | `/trechos/{id}` | | |
| GET | `/trechos/pesos?idUsuario=&hora=` | Grafo com pesos (consumido pelo Python) | US06, US12 |
| GET | `/ranking/bairros` | Melhores e piores bairros | US15 |
| GET | `/ranking/usuarios` | *(Could)* maiores contribuidores | US19 |
| GET / POST | `/rotas-favoritas` | *(Could)* | US16 |
| DELETE | `/rotas-favoritas/{id}` | *(Could)* | US16 |

Formato de erro padrão:
```json
{ "timestamp": "2026-11-12T10:00:00", "status": 404, "erro": "Ocorrência 99 não encontrada" }
```

## Integrações
- ⬅️ **Caio:** DER e scripts SQL
- ➡️ **Rickk:** tabela de endpoints, CORS e URL do Render
- ➡️ **Dudu:** `GET /trechos/pesos`
- ➡️ **Lau:** URL ou nome do serviço para o DNS no Packet Tracer

## Como executar *(completar)*
```bash
./mvnw spring-boot:run
```
Variáveis de ambiente: `DB_URL`, `DB_USER`, `DB_PASSWORD` (nunca commitar credenciais).
