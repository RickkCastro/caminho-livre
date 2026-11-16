# Implementation Plan: API REST Caminho Livre (Java)

**Branch**: `001-api-rest-java` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-api-rest-java/spec.md`

## Summary

API REST em Spring Boot que expõe o núcleo do Caminho Livre: login Google, ocorrências (alertas) com confirmação/expiração, cálculo da rota acessível (Dijkstra sobre os trechos com pesos) na própria API, perfil, preferências, rankings e exclusão de conta (LGPD). Camadas model (entidades JPA) / repository (Spring Data JPA) / service / controller / exception sobre o Oracle da FIAP, deploy no Render via Docker.

## Technical Context

**Language/Version**: Java 21

**Primary Dependencies**: Spring Boot 4.1 (webmvc, data-jpa, validation), Oracle JDBC (ojdbc17), Lombok, springdoc-openapi (Swagger), google-api-client (verificação do ID token)

**Storage**: Oracle (FIAP), schema de `database/scripts/01_create.sql`

**Testing**: JUnit 5 + Mockito nos services (regras de negócio); teste manual dos endpoints pelo [quickstart](quickstart.md)

**Target Platform**: Container Docker no Render (Linux)

**Project Type**: web-service

**Performance Goals**: `GET /ocorrencias` ≤ 1 s, `GET /rotas` ≤ 2 s com a carga de demonstração

**Constraints**: Deploy até 15/11; entrega 19/11 23h55; credenciais só por variáveis de ambiente

**Scale/Scope**: Demo acadêmica — ~10 linhas por tabela, dezenas de usuários

## Constitution Check

| Princípio | Status | Como o plano atende |
|---|---|---|
| I. Backlog é a fonte da verdade | ✅ | Cada endpoint do [contrato](contracts/api.md) cita a US; nada de US21/US22 |
| II. MVP primeiro | ✅ | Fases: Must (auth, ocorrências, pesos) → Should → Could |
| III. Acessibilidade | ✅ N/A | API sem UI; mensagens de erro em português simples para o front exibir |
| IV. Privacidade (LGPD) | ✅ | Token Google validado a cada chamada, sem senha; respostas públicas sem autor; DELETE anonimiza |
| V. Contrato único | ✅ | [contracts/api.md](contracts/api.md) espelha `api-java/README.md`; [data-model.md](data-model.md) espelha `database/README.md` |

Pós-design: sem violações. Complexity Tracking vazio.

## Project Structure

### Documentation (this feature)

```text
specs/001-api-rest-java/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/api.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
api-java/caminholivre-backend/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/java/br/com/caminholivre/
    │   ├── model/        entidades JPA: Usuario, CategoriaOcorrencia, Localizacao, Ocorrencia, Confirmacao, PreferenciaRota, Trecho, RotaFavorita
    │   ├── repository/   um JpaRepository por entidade
    │   ├── service/      AuthService, OcorrenciaService, ConfirmacaoService, TrechoService, RotaService, UsuarioService, RankingService
    │   ├── controller/   um controller por recurso
    │   ├── exception/    GlobalExceptionHandler, RecursoNaoEncontradoException, RegraNegocioException, ConflitoException, NaoAutorizadoException
    │   └── config/       CorsConfig, GoogleTokenFilter, agendamento da expiração
    ├── main/resources/application.properties
    └── test/java/br/com/caminholivre/service/
```

**Structure Decision**: Projeto único em `api-java/caminholivre-backend/` (gerado no Spring Initializr), com Spring Data JPA no padrão visto em aula: repository faz o papel da camada DAO e service o da camada BO pedidas na rubrica. `ddl-auto=none`: as tabelas vêm de `database/scripts/`.

## Complexity Tracking

Nenhuma violação.
