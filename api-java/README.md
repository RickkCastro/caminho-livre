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
- Uma ocorrência nasce `ABERTA`, com `dt_expiracao` = registro + 15 dias.
- Com **3 confirmações positivas** ela passa para `CONFIRMADA`.
- Um usuário só confirma uma vez cada ocorrência e não confirma a própria.
- Apenas o perfil `GESTOR` pode marcar como `RESOLVIDA`.
- Ocorrências vencidas e não confirmadas passam para `EXPIRADA`.
- O peso do trecho é `distância × (1 + Σ pesos das ocorrências ativas próximas)`, usando `peso_noturno` entre 19h e 6h e multiplicador por perfil.

## Tabela de endpoints (contrato com o front)
| Método | Rota | Descrição |
|---|---|---|
| GET / POST | `/usuarios` | Listar / cadastrar |
| GET / PUT / DELETE | `/usuarios/{id}` | Buscar / atualizar / remover |
| GET / POST | `/categorias` | Listar / cadastrar |
| GET / PUT / DELETE | `/categorias/{id}` | |
| GET / POST | `/localizacoes` | |
| GET / PUT / DELETE | `/localizacoes/{id}` | |
| GET | `/ocorrencias?bairro=&tipo=&status=` | Listar com filtros (mapa) |
| POST | `/ocorrencias` | Registrar ocorrência |
| GET / PUT / DELETE | `/ocorrencias/{id}` | |
| POST | `/ocorrencias/{id}/confirmacoes` | Confirmar ou negar |
| PUT | `/ocorrencias/{id}/resolver` | Gestor resolve |
| GET / POST | `/trechos` | |
| GET / PUT / DELETE | `/trechos/{id}` | |
| GET | `/trechos/pesos?perfil=&hora=` | Grafo com pesos (consumido pelo Python) |
| GET / POST | `/rotas-salvas` | |
| DELETE | `/rotas-salvas/{id}` | |

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
