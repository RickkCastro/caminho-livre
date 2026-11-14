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
- [ ] Camadas **DAO** e **BO** (10): no padrão Spring Data JPA visto em aula, **repository** e **service**
- [ ] **Controller** com GET, POST, PUT e DELETE (10)
- [ ] **Tratamento de exceções** (10)
- [ ] **Deploy no Render** (30) ⚠️ *fazer até 15/11*

> ⚠️ Commits feitos após a data de entrega **zeram toda a parte técnica**.

## Estrutura
Projeto em [`caminholivre-backend/`](caminholivre-backend/) (Spring Boot 4.1, Java 21, Spring Data JPA).
```
src/main/java/br/com/caminholivre/
├── model/        entidades JPA: Usuario, CategoriaOcorrencia, Localizacao, Ocorrencia, Confirmacao, PreferenciaRota, Trecho, RotaFavorita
├── repository/   um JpaRepository por entidade
├── service/      regras de negócio (confirmar, expirar, resolver, calcular peso, rota)
├── controller/   endpoints REST
├── exception/    @RestControllerAdvice, RecursoNaoEncontradoException, RegraNegocioException
└── config/       CORS para o front, filtro do token Google, agendamento da expiração
```

## Regras de negócio (services)
Alinhadas ao [backlog MoSCoW](../agile/backlog.md):
- Uma ocorrência nasce `ABERTA`, com `dt_expiracao` = registro + 15 dias (US08).
- Com **3 confirmações positivas (👍)** ela passa para `CONFIRMADA` (US07).
- Com **3 negações (👎)**, contadas no total e não como saldo, ela passa para `RESOLVIDA` ("o problema não existe mais"). Não há painel de gestor (US21 é Won't).
- Um usuário só avalia uma vez cada ocorrência e não avalia a própria.
- Ocorrências vencidas e não confirmadas passam para `EXPIRADA` (US08).
- O peso do trecho é `distância × (1 + Σ pesos das ocorrências ativas próximas)`, usando `peso_noturno` entre 19h e 6h, ignorando as categorias passadas em `ignorar` (o front lê de `PREFERENCIA_ROTA`, US11). Com `mobilidadeReduzida=S`, categorias com `bloqueia_mobilidade = S` (Degrau, Falta de rampa) bloqueiam o trecho. A rota não recebe `idUsuario` (LGPD).
- *(Could)* +10 pontos ao enviar um alerta e +2 ao avaliar (US17, US18).
- Login com Google: `POST /auth/google` recebe o ID token, valida com o Google, cria o usuário no primeiro acesso e devolve os dados dele. A API não guarda senha.

## Tabela de endpoints (contrato com o front)
| Método | Rota | Descrição | História |
|---|---|---|---|
| POST | `/auth/google` | Entrar com Google (cria a conta no primeiro acesso). Resposta inclui `primeiroAcesso` | US01 |
| GET | `/usuarios` | Listar usuários | US01 |
| GET / PUT / DELETE | `/usuarios/{id}` | Buscar / atualizar perfil (nome, foto, mobilidade reduzida) / excluir conta (apaga dados pessoais e anonimiza os alertas) | US12, US13, US15 |
| GET | `/usuarios/{id}/ocorrencias` | Minhas ocorrências | US10 |
| GET / PUT | `/usuarios/{id}/preferencias` | Categorias que a rota considera | US11 |
| GET / POST | `/categorias` | Listar / cadastrar | US02 |
| GET / PUT / DELETE | `/categorias/{id}` | | |
| GET / POST | `/localizacoes` | | |
| GET / PUT / DELETE | `/localizacoes/{id}` | | |
| GET | `/ocorrencias?bairro=&tipo=&status=` | Listar com filtros (mapa) | US03 |
| POST | `/ocorrencias` | Enviar alerta (inclui alagamento) | US02 |
| GET / PUT / DELETE | `/ocorrencias/{id}` | Detalhe (`minha` = true se o token opcional for do autor) / editar / remover | US09 |
| POST | `/ocorrencias/{id}/confirmacoes` | Avaliar 👍/👎 | US07 |
| GET / POST | `/trechos` | | |
| GET / PUT / DELETE | `/trechos/{id}` | | |
| GET | `/rotas?origemLat=&origemLon=&destinoLat=&destinoLon=&hora=&mobilidadeReduzida=&ignorar=` | Rota comum × Caminho Livre (Dijkstra na API) | US04, US11 |
| GET | `/trechos/pesos?hora=&mobilidadeReduzida=&ignorar=` | Grafo com pesos (depuração; mesmo formato do mock do Dynamic Programming) | US04, US11 |
| GET | `/ranking/bairros` | Melhores e piores bairros | US14 |
| GET | `/ranking/usuarios` | *(Could)* maiores contribuidores | US19 |
| GET / POST | `/rotas-favoritas` | *(Could)* | US16 |
| DELETE | `/rotas-favoritas/{id}` | *(Could)* | US16 |

Códigos: 400 validação · 401 token · 403 não é o dono · 404 · 409 duplicidade · 422 regra de negócio · 503 banco.

Formato de erro padrão:
```json
{ "timestamp": "2026-11-12T10:00:00", "status": 404, "erro": "Ocorrência 99 não encontrada" }
```

## Integrações
- ⬅️ **Caio:** DER e scripts SQL
- ➡️ **Rickk:** tabela de endpoints, CORS e URL do Render
- ➡️ **Lau:** URL ou nome do serviço para o DNS no Packet Tracer

## Como executar *(completar)*
```bash
cd api-java/caminholivre-backend
./mvnw spring-boot:run
```
Variáveis de ambiente: `DB_URL`, `DB_USER`, `DB_PASSWORD` (nunca commitar credenciais).
