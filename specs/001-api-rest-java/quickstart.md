# Quickstart: validar a API

## Pré-requisitos
JDK 21, Maven (ou `./mvnw`), acesso ao Oracle da FIAP com `database/scripts/01_create.sql` e `02_insert.sql` rodados, um OAuth Client ID do Google.

## Rodar
```bash
cd api-java/caminholivre-backend
# credenciais no .env (ver api-java/README.md) ou exportadas:
export DB_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL DB_USER=... DB_PASSWORD=... GOOGLE_CLIENT_ID=... FRONT_URL=http://localhost:3000
./mvnw test
./mvnw spring-boot:run
```

## Cenários (ver [contrato](contracts/api.md))
| # | Ação | Esperado |
|---|---|---|
| 1 | `POST /auth/google` com token válido (pegar no front ou no OAuth Playground) | 201 na 1ª vez, 200 na 2ª, mesmo `id` |
| 2 | `POST /auth/google` com `"idToken":"x"` | 401 no formato de erro |
| 3 | `POST /ocorrencias` sem `idCategoria` | 400 citando o campo |
| 4 | `POST /ocorrencias` válido | 201, `status=ABERTA`, `dtExpiracao` = +15 dias |
| 5 | `GET /ocorrencias?tipo=CLIMA` | só alagamentos ativos, sem dados do autor |
| 6 | `GET /trechos/pesos?hora=14` e `hora=22` | pesos noturnos maiores nos trechos com "Rua escura" |
| 7 | Mesmo com `mobilidadeReduzida=S` | trecho com Degrau `bloqueado=true` |
| 8 | 3 usuários distintos `POST /ocorrencias/{id}/confirmacoes` `true` | `status=CONFIRMADA` |
| 9 | Autor avalia a própria / alguém avalia 2× | 422 / 409 |
| 10 | Forçar `dt_expiracao` no passado e `GET /ocorrencias` | ocorrência some (EXPIRADA) |
| 11 | `DELETE /usuarios/{id}` | 204; `GET /ocorrencias/{idDele}` ainda existe; usuário não aparece em lugar nenhum |
| 12 | Deploy: `curl https://<servico>.onrender.com/categorias` | 200 |
| 13 | `curl -o /dev/null -w "%{time_total}"` em `GET /ocorrencias` e `GET /rotas` (Render acordado) | ≤ 1 s e ≤ 2 s (SC-001, SC-002) |
| 14 | Detalhe de ocorrência própria com e sem token | `minha=true` com token do autor, `false` sem token |
| 15 | `GET /rotas` entre dois pontos com uma ocorrência ativa no caminho mais curto | `comum` passa pela ocorrência; `caminhoLivre` desvia e é mais longa |
| 16 | Mesmo com `mobilidadeReduzida=S` e só caminhos com Degrau | `caminhoLivre=null` e `aviso` |
