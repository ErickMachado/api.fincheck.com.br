# Design: Cadastro de Usuários

## Visão Geral

Esta funcionalidade entrega o ponto de entrada do Fincheck: duas rotas públicas que permitem a um visitante criar sua conta e, em seguida, comprovar a posse do endereço de e-mail informado. Como o projeto ainda não possui persistência, gateways nem suíte de testes, esta é também a entrega que estabelece a fundação técnica do produto — conexão com o PostgreSQL, versionamento de esquema, repositórios, adaptação de controllers ao Fastify, envio de e-mail por SMTP e o orquestrador de testes de integração.

O cadastro recebe primeiro nome, último nome, e-mail e senha, apara os espaços das bordas, valida o formato, normaliza o endereço de e-mail e tenta criar a conta junto de um token de ativação de uso único válido por 15 minutos. A criação e a recusa por e-mail já existente produzem exatamente a mesma resposta, sem que a API revele quem possui conta. A verificação recebe apenas o token, marca o e-mail como verificado e invalida o token. Nenhum dos dois fluxos inicia sessão ou devolve credenciais.

## Variáveis de Ambiente

| Nome                | Formato   | Descrição                                                                                               | Sensível | Status |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------------ | :------- | :----- |
| `APP_WEB_URL`       | `string`  | URL base da aplicação cliente usada para montar o link de ativação (ex.: `https://app.fincheck.com.br`) | ❌       | Novo   |
| `POSTGRES_DATABASE` | `string`  | Nome do banco de dados                                                                                  | ❌       | Novo   |
| `POSTGRES_HOST`     | `string`  | Endereço do servidor PostgreSQL                                                                         | ❌       | Novo   |
| `POSTGRES_PASSWORD` | `string`  | Senha do usuário do banco                                                                               | ✅       | Novo   |
| `POSTGRES_PORT`     | `number`  | Porta do servidor PostgreSQL                                                                            | ❌       | Novo   |
| `POSTGRES_SSL`      | `boolean` | Liga a conexão cifrada com o banco; `false` em desenvolvimento e em teste                               | ❌       | Novo   |
| `POSTGRES_USER`     | `string`  | Usuário do banco                                                                                        | ❌       | Novo   |
| `SMTP_FROM_ADDRESS` | `string`  | Remetente das mensagens transacionais (ex.: `Fincheck <notifications@fincheck.com.br>`)                 | ❌       | Novo   |
| `SMTP_HOST`         | `string`  | Endereço do relay SMTP (ex.: `smtp.resend.com`)                                                         | ❌       | Novo   |
| `SMTP_PASSWORD`     | `string`  | Senha do relay SMTP; no Resend, a chave de API                                                          | ✅       | Novo   |
| `SMTP_PORT`         | `number`  | Porta do relay SMTP                                                                                     | ❌       | Novo   |
| `SMTP_SECURE`       | `boolean` | Liga o TLS implícito; `true` na porta `465` e `false` no MailCatcher                                    | ❌       | Novo   |
| `SMTP_USER`         | `string`  | Usuário do relay SMTP; no Resend, o literal `resend`                                                    | ❌       | Novo   |

Todas são obrigatórias e validadas por `Configuration` na subida do processo. Os arquivos `.env.example` e `.env.test` passam a agrupá-las por contexto:

```
APP_ENV="development"
APP_HOST="127.0.0.1"
APP_PORT="4000"
APP_WEB_URL="https://app.fincheck.com.br"

POSTGRES_DATABASE="fincheck"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="local_password"
POSTGRES_PORT="5432"
POSTGRES_SSL="false"
POSTGRES_USER="local_user"

SMTP_FROM_ADDRESS="Fincheck <notifications@fincheck.com.br>"
SMTP_HOST="localhost"
SMTP_PASSWORD=""
SMTP_PORT="1025"
SMTP_SECURE="false"
SMTP_USER=""
```

> Em `.env.test`, as variáveis dos grupos `POSTGRES_` e `SMTP_` recebem valores de espaço reservado: o orquestrador as sobrescreve com o host e a porta dinâmicos dos contêineres antes de instanciar a `Configuration`.

## Arquivos

| Caminho                                                                       | Camada        | Descrição                                                                                                          | Status   |
| :---------------------------------------------------------------------------- | :------------ | :----------------------------------------------------------------------------------------------------------------- | :------- |
| `src/common/core/config.ts`                                                   | `common`      | Passa a validar e expor os grupos `APP_`, `POSTGRES_` e `SMTP_`                                                    | Alterado |
| `src/common/http/statuses.ts`                                                 | `common`      | Recebe `NoContent = 204`, usado pelas duas rotas em caso de sucesso                                                | Alterado |
| `src/common/http/problem.ts`                                                  | `common`      | Ganha a fábrica genérica `Problem.from` para disparar erros conhecidos sem criar classes de erro customizadas      | Alterado |
| `src/common/http/controller.ts`                                               | `common`      | Declara `Controller`, `HTTPRequest` e `HTTPResponse`, mantendo controllers independentes do Fastify                | Novo     |
| `src/domain/value-objects/email.ts`                                           | `domain`      | Objeto de valor que normaliza o endereço de e-mail (minúsculas e remoção do apelido após `+`)                      | Novo     |
| `src/domain/entities/user.ts`                                                 | `domain`      | Entidade `User`: gera o ULID, os metadados de criação e nasce com o e-mail não verificado                          | Novo     |
| `src/domain/entities/user-activation-token.ts`                                | `domain`      | Entidade do token de ativação: gera o valor aleatório, a validade de 15 minutos e decide se ainda pode ser usado   | Novo     |
| `src/domain/repositories/user.ts`                                             | `domain`      | Interface de acesso a dados do agregado `User`, incluindo o token de verificação                                   | Novo     |
| `src/application/interfaces/hasher.ts`                                        | `application` | Interface de derivação de hash de senha, isolando o algoritmo do caso de uso                                       | Novo     |
| `src/application/interfaces/mailer.ts`                                        | `application` | Interface de envio do e-mail de ativação, mantendo transporte e conteúdo da mensagem fora do caso de uso           | Novo     |
| `src/application/usecases/auth/create-user.ts`                                | `application` | `CreateUserUseCase`: normaliza, deriva o hash, tenta criar a conta e dispara o e-mail apenas se ela for criada     | Novo     |
| `src/application/usecases/auth/activate-user.ts`                              | `application` | `ActivateUserUseCase`: localiza o token, valida a usabilidade e confirma o e-mail                                  | Novo     |
| `src/application/controllers/auth/create-user.ts`                             | `application` | `CreateUserController`: valida o corpo com Zod, chama o caso de uso e responde `204`                               | Novo     |
| `src/application/controllers/auth/activate-user.ts`                           | `application` | `ActivateUserController`: valida a presença do token, chama o caso de uso e responde `204`                         | Novo     |
| `src/infra/database/connection.ts`                                            | `infra`       | Encapsula o pool do `pg`, expõe `query`, `transaction` e o encerramento da conexão                                 | Novo     |
| `src/infra/database/repositories/user.ts`                                     | `infra`       | Implementa `UserRepository` em SQL, dentro de transações explícitas, e traduz erros do PostgreSQL                  | Novo     |
| `src/infra/database/migrations/<timestamp>_create-users.sql`                  | `infra`       | Cria a tabela `users` com a restrição de unicidade do e-mail                                                       | Novo     |
| `src/infra/database/migrations/<timestamp>_create-user-activation-tokens.sql` | `infra`       | Cria a tabela `user_activation_tokens` com a restrição de unicidade do token                                       | Novo     |
| `src/infra/docker/compose.yml`                                                | `infra`       | Sobe um PostgreSQL e um MailCatcher locais para desenvolvimento                                                    | Novo     |
| `src/infra/mail/smtp-mailer.ts`                                               | `infra`       | Implementa `Mailer` sobre o `nodemailer`, renderiza o template e traduz falhas de entrega                          | Novo     |
| `src/infra/mail/templates/account-activation.tsx`                             | `infra`       | Componente react-email do e-mail de ativação, estilizado com o componente `Tailwind`                               | Novo     |
| `src/infra/mail/templates/tailwind.ts`                                        | `infra`       | Configuração de tema compartilhada pelos templates (cores, fontes e espaçamentos da marca)                         | Novo     |
| `src/infra/security/argon2-hasher.ts`                                         | `infra`       | Implementa `Hasher` com Argon2id e os parâmetros de custo do produto                                               | Novo     |
| `src/main/adapters/controller.ts`                                             | `main`        | Adapta um `Controller` para um handler do Fastify, traduzindo requisição e resposta                                | Novo     |
| `src/main/router.ts`                                                          | `main`        | Declara `POST /v1/auth/users` e `POST /v1/auth/users/activations`                                                  | Novo     |
| `src/main/app.ts`                                                             | `main`        | Conecta ao banco, instancia repositórios, gateways, casos de uso e controllers, registra as rotas e encerra o pool | Alterado |
| `tests/setup/orchestrator.ts`                                                 | `tests`       | Sobe PostgreSQL e MailCatcher, roda migrações, inicia e para a API, limpa o estado e expõe utilitários de cadastro | Novo     |
| `tests/setup/mailbox.ts`                                                      | `tests`       | Classe utilitária sobre a API HTTP do MailCatcher: lista mensagens, lê o HTML e o texto puro e limpa a caixa       | Novo     |
| `tests/mocks/users.ts`                                                        | `tests`       | Construtores de dados de cadastro aleatórios com `@faker-js/faker`                                                 | Novo     |
| `tests/integration/api/auth/create-user.spec.ts`                              | `tests`       | Suíte blackbox de `POST /v1/auth/users`                                                                            | Novo     |
| `tests/integration/api/auth/activate-user.spec.ts`                            | `tests`       | Suíte blackbox de `POST /v1/auth/users/activations`                                                                | Novo     |
| `package.json`                                                                | -             | Novas dependências e scripts de migração                                                                           | Alterado |
| `tsconfig.json`                                                               | -             | Apelidos `@application/*`, `@domain/*`, `@infra/*` e `@tests/*`; `jsx: react-jsx` e `DOM` em `lib`                 | Alterado |
| `vitest.config.ts`                                                            | -             | Limiar de cobertura de 90% sobre `src` e `hookTimeout` folgado para a subida dos contêineres no `beforeAll`        | Alterado |
| `.env.example`                                                                | -             | Declara as novas variáveis agrupadas por contexto                                                                  | Alterado |
| `.env.test`                                                                   | -             | Declara as novas variáveis com valores de teste                                                                    | Alterado |

## Contratos

### `Controller` — `src/common/http/controller.ts`

```ts
type HTTPRequest = Readonly<{
  body: unknown
  params: unknown
  query: unknown
}>

type HTTPResponse = Readonly<{
  body?: unknown
  status: StatusCode
}>

interface Controller {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
```

### `UserRepository` — `src/domain/repositories/user.ts`

```ts
type CreateUserInput = Readonly<{
  token: UserActivationToken
  user: User
}>

interface UserRepository {
  activateUser(token: UserActivationToken): Promise<boolean>
  create(input: CreateUserInput): Promise<boolean>
  findActivationToken(value: string): Promise<UserActivationToken | null>
}
```

> `create` devolve `false` quando o e-mail já pertence a alguma conta, sem lançar erro e sem escrever nada. `activateUser` devolve `false` quando o token deixou de estar disponível entre a leitura e a escrita.

### `Hasher` — `src/application/interfaces/hasher.ts`

```ts
interface Hasher {
  hash(plain: string): Promise<string>
}
```

### `Mailer` — `src/application/interfaces/mailer.ts`

```ts
type AccountActivationInput = Readonly<{
  activationURL: string
  firstName: string
  to: string
}>

interface Mailer {
  sendAccountActivation(input: AccountActivationInput): Promise<void>
}
```

### `Database` — `src/infra/database/connection.ts`

```ts
type PostgresConfig = Readonly<{
  database: string
  host: string
  password: string
  port: number
  ssl: boolean
  user: string
}>

class Database {
  public static async connect(config: PostgresConfig): Promise<Database>
  public async query<T>(statement: string, values?: unknown[]): Promise<QueryResult<T>>
  public async transaction<T>(handler: (client: PoolClient) => Promise<T>): Promise<T>
  public async disconnect(): Promise<void>
}
```

> `transaction` retira um cliente do pool, emite `BEGIN`, executa o handler, emite `COMMIT` quando ele resolve e `ROLLBACK` quando ele lança, sempre devolvendo o cliente ao pool. É o único ponto da base de código com `try-catch`, permitido por ser camada `infra`.

### `SMTPConfig` — `src/infra/mail/smtp-mailer.ts`

```ts
type SMTPConfig = Readonly<{
  fromAddress: string
  host: string
  password: string
  port: number
  secure: boolean
  user: string
}>
```

### `Email` — `src/domain/value-objects/email.ts`

```ts
class Email {
  public readonly value: string

  public static create(value: string): Email
}
```

> Normalização: todo o endereço vai para minúsculas e, quando o nome do usuário contém `+` em posição diferente da primeira, tudo a partir do `+` até o `@` é descartado. Pontos são preservados.

### `User` — `src/domain/entities/user.ts`

```ts
type CreateUserProperties = Readonly<{
  email: Email
  firstName: string
  lastName: string
  passwordHash: string
}>

class User {
  public readonly id: string
  public readonly email: string
  public readonly firstName: string
  public readonly lastName: string
  public readonly passwordHash: string
  public verifiedAt: Date | null
  public readonly createdAt: Date
  public updatedAt: Date

  public static create(properties: CreateUserProperties): User
}
```

### `UserActivationToken` — `src/domain/entities/user-activation-token.ts`

```ts
type RestoreTokenProperties = Readonly<{
  createdAt: Date
  expiresAt: Date
  id: string
  usedAt: Date | null
  userId: string
  value: string
}>

class UserActivationToken {
  public readonly id: string
  public readonly userId: string
  public readonly expiresAt: Date
  public usedAt: Date | null
  public readonly value: string
  public readonly createdAt: Date

  public static create(userId: string): UserActivationToken
  public static restore(properties: RestoreTokenProperties): UserActivationToken
  public isUsable(): boolean
}
```

> `userId` é a propriedade da classe de domínio; a coluna correspondente chama-se `user_id_fk`, conforme o padrão de banco de dados. `verifiedAt`, `updatedAt` e `usedAt` não são `readonly` porque representam estado que muda ao longo da vida da entidade.

### `AccountActivationEmail` — `src/infra/mail/templates/account-activation.tsx`

```tsx
type AccountActivationEmailProperties = Readonly<{
  activationURL: string
  firstName: string
}>

function AccountActivationEmail(properties: AccountActivationEmailProperties): JSX.Element
```

> O componente é envolvido por `<Tailwind config={TAILWIND_CONFIG}>` e renderizado pelo `SMTPMailer` com `render`, que devolve o HTML com os estilos já embutidos, e com `render(..., { plainText: true })`, que devolve a alternativa em texto puro.

## Rotas

| Método | Caminho                      | Descrição                                                             | Status |
| :----- | :--------------------------- | :-------------------------------------------------------------------- | :----- |
| `POST` | `/v1/auth/users`             | Cria uma conta e dispara o e-mail com o link de ativação              | Novo   |
| `POST` | `/v1/auth/users/activations` | Consome o token de ativação e marca o e-mail da conta como verificado | Novo   |

---

### `POST /v1/auth/users`

Recebe os dados do visitante, apara os espaços das bordas, valida o formato, normaliza o e-mail e cria a conta com o e-mail não verificado, enviando o link de ativação ao endereço informado. Quando o endereço normalizado já pertence a uma conta, nada é criado, nenhuma mensagem é enviada e a resposta é idêntica à de um cadastro novo.

#### Parâmetros de rota

Não se aplica.

#### Parâmetros de consulta

Não se aplica.

#### Corpo

```json
{
  "email": "Tifa.Lockhart+financas@Gmail.com",
  "first_name": "Tifa",
  "last_name": "Lockhart",
  "password": "m1dg4r 1s 4ws0m3"
}
```

| Nome         | Tipo     | Padrão | Regras                                                                                           |
| :----------- | :------- | :----- | :----------------------------------------------------------------------------------------------- |
| `email`      | `string` | `-`    | Obrigatório; espaços das bordas removidos; formato de e-mail válido; no máximo 254 caracteres    |
| `first_name` | `string` | `-`    | Obrigatório; espaços das bordas removidos; entre 2 e 100 caracteres após a remoção               |
| `last_name`  | `string` | `-`    | Obrigatório; espaços das bordas removidos; entre 2 e 100 caracteres após a remoção               |
| `password`   | `string` | `-`    | Obrigatório; entre 8 e 64 caracteres contando espaços; sem regras de composição; nunca é aparada |

#### Respostas

| Status | Tipo                   | Quando                                                                                        |
| :----- | :--------------------- | :-------------------------------------------------------------------------------------------- |
| `204`  | `sem corpo`            | O corpo é válido, tenha a conta sido criada ou o e-mail já pertencido a alguém                |
| `400`  | `Problem` de validação | Algum campo está ausente ou fora do formato aceito; `errors` aponta todos os campos inválidos |
| `500`  | `Problem` interno      | Falha ao gravar no banco ou ao entregar a mensagem ao relay SMTP                              |

---

### `POST /v1/auth/users/activations`

Recebe apenas o token do link de ativação. Quando o token existe, está dentro da validade e nunca foi usado, o e-mail da conta correspondente passa a constar como verificado e o token deixa de valer. Token desconhecido, expirado ou já utilizado produzem a mesma recusa.

#### Parâmetros de rota

Não se aplica.

#### Parâmetros de consulta

Não se aplica.

#### Corpo

```json
{
  "token": "7f6cad6c70faeeeaedbe9e03f3e18684"
}
```

| Nome    | Tipo     | Padrão | Regras                                                                                                                |
| :------ | :------- | :----- | :-------------------------------------------------------------------------------------------------------------------- |
| `token` | `string` | `-`    | Obrigatório; texto não vazio; comparado exatamente como gerado, sem normalização de caixa e sem outro formato exigido |

#### Respostas

| Status | Tipo                   | Quando                                                                                        |
| :----- | :--------------------- | :-------------------------------------------------------------------------------------------- |
| `204`  | `sem corpo`            | O token existe, está dentro dos 15 minutos e ainda não havia sido usado                       |
| `400`  | `Problem` de validação | O campo `token` está ausente, não é texto ou está vazio                                       |
| `400`  | `Problem` de token     | O token é desconhecido, está expirado ou já foi utilizado — resposta única para os três casos |
| `500`  | `Problem` interno      | Falha ao consultar ou gravar no banco                                                         |

## Banco de Dados

### `public`.`users`

#### Colunas

| Nome            | Tipo           | Obrigatória | Descrição                                                               | Status |
| :-------------- | :------------- | :---------- | :---------------------------------------------------------------------- | :----- |
| `id`            | `CHAR(26)`     | ✅          | Identificador da conta em ULID, gerado na entidade de domínio           | Novo   |
| `first_name`    | `VARCHAR(100)` | ✅          | Primeiro nome já aparado                                                | Novo   |
| `last_name`     | `VARCHAR(100)` | ✅          | Último nome já aparado                                                  | Novo   |
| `email`         | `VARCHAR(254)` | ✅          | Endereço normalizado (minúsculo e sem apelido); identificador da pessoa | Novo   |
| `password_hash` | `TEXT`         | ✅          | Hash Argon2id da senha, com os parâmetros de custo embutidos            | Novo   |
| `verified_at`   | `TIMESTAMPTZ`  | ❌          | Instante em que o e-mail foi verificado; nulo enquanto não verificado   | Novo   |
| `created_at`    | `TIMESTAMPTZ`  | ✅          | Instante de criação da conta, em UTC                                    | Novo   |
| `updated_at`    | `TIMESTAMPTZ`  | ✅          | Instante da última alteração, em UTC                                    | Novo   |

#### Índices

| Nome                 | Tipo          | Descrição                                                                       | Status |
| :------------------- | :------------ | :------------------------------------------------------------------------------ | :----- |
| `users_pkey`         | `PRIMARY KEY` | Chave primária sobre `id`                                                       | Novo   |
| `users_email_unique` | `UNIQUE`      | Impede duas contas para o mesmo endereço normalizado e sustenta o `ON CONFLICT` | Novo   |

### `public`.`user_activation_tokens`

#### Colunas

| Nome         | Tipo          | Obrigatória | Descrição                                                                        | Status |
| :----------- | :------------ | :---------- | :------------------------------------------------------------------------------- | :----- |
| `id`         | `CHAR(26)`    | ✅          | Identificador do token em ULID                                                   | Novo   |
| `user_id_fk` | `CHAR(26)`    | ✅          | Conta que originou o token; sufixo `_fk` por armazenar uma chave estrangeira     | Novo   |
| `token`      | `CHAR(32)`    | ✅          | Valor aleatório em hexadecimal minúsculo que viaja no link, comparado exatamente | Novo   |
| `expires_at` | `TIMESTAMPTZ` | ✅          | Instante em que o token deixa de valer, 15 minutos após a criação                | Novo   |
| `used_at`    | `TIMESTAMPTZ` | ❌          | Instante em que o token foi consumido; nulo enquanto disponível                  | Novo   |
| `created_at` | `TIMESTAMPTZ` | ✅          | Instante de criação do token, em UTC                                             | Novo   |

#### Índices

| Nome                                     | Tipo          | Descrição                                                                    | Status |
| :--------------------------------------- | :------------ | :--------------------------------------------------------------------------- | :----- |
| `user_activation_tokens_pkey`            | `PRIMARY KEY` | Chave primária sobre `id`                                                    | Novo   |
| `user_activation_tokens_token_unique`    | `UNIQUE`      | Garante que o token é único no produto e acelera a busca por valor           | Novo   |
| `user_activation_tokens_user_id_fk_idx`  | `INDEX`       | Acelera a busca dos tokens de uma conta, usada no fluxo de reenvio           | Novo   |
| `user_activation_tokens_user_id_fk_fkey` | `FOREIGN KEY` | Referencia `users(id)` com `ON DELETE CASCADE` e apaga os tokens com a conta | Novo   |

### Escritas

As duas escritas tocam mais de uma tabela e correm dentro de uma transação explícita aberta pelo `Database.transaction`.

Criação da conta. O `ON CONFLICT (email) DO NOTHING` elimina a corrida entre dois cadastros simultâneos com o mesmo e-mail: quando o `INSERT` não devolve linha, o repositório encerra a transação sem escrever e devolve `false`, sem que o cliente perceba diferença.

```sql
BEGIN;

INSERT INTO users (id, first_name, last_name, email, password_hash, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $6)
ON CONFLICT (email) DO NOTHING
RETURNING id;

INSERT INTO user_activation_tokens (id, user_id_fk, token, expires_at, created_at)
VALUES ($7, $8, $9, $10, $6);

COMMIT;
```

Consumo do token. A guarda `used_at IS NULL` garante o uso único mesmo sob concorrência: quando o `UPDATE` não devolve linha, o repositório encerra a transação e devolve `false`.

```sql
BEGIN;

UPDATE user_activation_tokens
SET used_at = $1
WHERE id = $2 AND used_at IS NULL
RETURNING user_id_fk;

UPDATE users
SET verified_at = $1, updated_at = $1
WHERE id = $3;

COMMIT;
```

## Dependências

| Pacote                       | Produção | Versão    | Justificativa                                                                                         |
| :--------------------------- | :------- | :-------- | :---------------------------------------------------------------------------------------------------- |
| `pg`                         | ✅       | `8.23.0`  | Driver oficial do PostgreSQL com pool de conexões, transações explícitas e SQL escrito à mão          |
| `node-pg-migrate`            | ✅       | `9.0.0`   | Versionamento de esquema com migrações `.sql` e API programática usada pelo orquestrador de testes    |
| `ulidx`                      | ✅       | `2.4.1`   | Geração de ULID exigida pelo padrão de identificadores; ESM/TypeScript nativo e mantido               |
| `@node-rs/argon2`            | ✅       | `2.0.2`   | Argon2id com binários pré-compilados, compatível com `ignore-scripts = true` do `.npmrc`              |
| `nodemailer`                 | ✅       | `8.0.11`  | Cliente SMTP do ecossistema Node; recebe host, porta e credenciais separados e mantém o pool do relay |
| `@react-email/components`    | ✅       | `1.0.12`  | Componentes de e-mail, o componente `Tailwind` e o `render` que devolve HTML e texto puro             |
| `react`                      | ✅       | `19.2.8`  | Peer dependency do react-email; usada apenas para descrever os templates                              |
| `react-dom`                  | ✅       | `19.2.8`  | Peer dependency do `@react-email/render`, que serializa o componente com `react-dom/server`           |
| `@types/nodemailer`          | ❌       | `8.0.1`   | Tipos do cliente SMTP, publicados no DefinitelyTyped                                                  |
| `@types/react`               | ❌       | `19.2.18` | Tipos do React, necessários para compilar os templates em TSX                                         |
| `testcontainers`             | ❌       | `12.1.0`  | Ciclo de vida dos contêineres efêmeros de PostgreSQL e MailCatcher usados nos testes                  |
| `@testcontainers/postgresql` | ❌       | `12.1.0`  | Módulo de PostgreSQL do Testcontainers, que expõe host, porta, usuário, senha e banco separados       |
| `@faker-js/faker`            | ❌       | `10.5.0`  | Geração de dados de entrada aleatórios, exigida pelo padrão de testes                                 |
| `@vitest/coverage-v8`        | ❌       | `4.1.10`  | Medição da cobertura mínima de 90%; versão pareada com o `vitest` já instalado                        |

> Todas as versões respeitam o período de quarentena de 7 dias definido em `.npmrc`. Onde a versão mais recente é mais nova que a quarentena (`@node-rs/argon2@2.1.0`, `@faker-js/faker@10.6.0`, `@vitest/coverage-v8@4.1.11`), a versão imediatamente anterior foi selecionada. O `nodemailer` fica na linha `8.x` porque o `@types/nodemailer` ainda não publicou tipos para a `9.x`.
>
> O MailCatcher entra como imagem Docker (`sj26/mailcatcher:v0.10.0`, SMTP em `1025` e API HTTP em `1080`) subida pelo `GenericContainer` do `testcontainers`, sem pacote npm correspondente.

### Scripts adicionados ao `package.json`

| Script             | Comando                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------- |
| `migration:create` | `node-pg-migrate create --migrations-dir src/infra/database/migrations -j sql`          |
| `migration:up`     | `dotenv -e .env -- node-pg-migrate up --migrations-dir src/infra/database/migrations`   |
| `migration:down`   | `dotenv -e .env -- node-pg-migrate down --migrations-dir src/infra/database/migrations` |

> O prefixo de timestamp dos arquivos é gerado pelo `node-pg-migrate create`; nenhum nome de migração é escrito à mão.

## Decisões

| #      | Justificativa                                                                                                                                                                                                  | Alternativas                                                                                                                                                            |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-1  | A conta é criada com `INSERT ... ON CONFLICT (email) DO NOTHING` e o repositório devolve se houve criação. Não existe consulta prévia de existência, o que remove a janela de corrida entre dois cadastros     | Consultar `existsByEmail` antes de inserir: permite duas requisições concorrentes passarem pela consulta e uma delas receber um `23505`, que teria de virar `204`       |
| DEC-2  | O hash da senha é sempre derivado, mesmo quando o e-mail já pertence a alguém, para que o caminho existente não seja mensuravelmente mais rápido que o caminho novo                                            | Derivar o hash só quando a conta é criada: transforma o tempo de resposta em um oráculo de existência de conta, contrariando US-6                                       |
| DEC-3  | O token são 16 bytes de `crypto.randomBytes` serializados em hexadecimal minúsculo, resultando nos 32 caracteres do exemplo de CA-14 e em 128 bits de entropia                                                 | Reaproveitar o ULID: é ordenável no tempo e dedutível a partir de outro token, ferindo CA-15. JWT: carrega estado no próprio token e não permite invalidação            |
| DEC-4  | O token vive em `user_activation_tokens`, não em colunas de `users`, o que mantém `users` livre de estado transitório e já acomoda o fluxo futuro de reenvio, que emitirá vários tokens por conta              | Colunas `verification_token` e `verification_token_expires_at` em `users`: simples agora, mas exige migração assim que o reenvio existir                                |
| DEC-5  | A coluna que referencia a conta chama-se `user_id_fk`: mantém o `_id` que já nomeia identificadores no resto do esquema e acrescenta o sufixo `_fk` exigido pelo padrão de banco de dados                      | `user_fk`: mais curto, porém abandona o `_id` usado nas demais colunas de identificador e destoa da propriedade `userId` da classe de domínio                           |
| DEC-6  | As duas escritas correm em transação explícita aberta por `Database.transaction`, que concentra `BEGIN`, `COMMIT` e `ROLLBACK` em um único ponto da camada `infra`                                             | Espalhar `BEGIN`/`COMMIT` por cada método do repositório: repete o controle de erro e deixa fácil esquecer o `ROLLBACK` em um caminho de exceção                        |
| DEC-7  | O `token` é validado apenas quanto à presença e a não ser vazio. Qualquer valor que não case exatamente com um token disponível cai na mesma recusa genérica                                                   | Validar tamanho e alfabeto hexadecimal no Zod: produziria uma recusa de validação distinta da recusa de token, dando ao atacante um sinal a mais                        |
| DEC-8  | O token é enviado no corpo de um `POST`, não em parâmetro de consulta, para não ser registrado em logs de acesso, históricos de proxy e cabeçalhos `Referer`                                                   | `GET /v1/auth/users/activations?token=...`: conveniente para abrir direto no navegador, mas expõe o segredo em toda a cadeia de logs e é um `GET` com efeito colateral  |
| DEC-9  | A normalização do e-mail é um objeto de valor `Email` em `src/domain/value-objects`, aplicado antes de qualquer consulta ou escrita. É a regra BUS-2/BUS-3 e não uma questão de transporte                     | Normalizar no controller ou em um `transform` do Zod: espalha a regra de negócio pela borda HTTP e a repete a cada nova rota que aceite e-mail                          |
| DEC-10 | O Zod apenas apara espaços das bordas e valida formato e tamanho, mantendo as mensagens de erro alinhadas ao que o visitante digitou                                                                           | Deixar a aparagem para o domínio: os limites de 2 a 100 caracteres passariam a contar espaços de borda, contrariando CA-11                                              |
| DEC-11 | As senhas usam Argon2id via `@node-rs/argon2`, que distribui binários pré-compilados e portanto instala sob o `ignore-scripts = true` do `.npmrc`. Parâmetros: 19 MiB de memória, 2 iterações e paralelismo 1  | `argon2` e `bcrypt` nativos: exigem compilação em `postinstall`, bloqueada pelo `.npmrc`. `crypto.scrypt` embutido: aceitável, porém menos resistente a GPU             |
| DEC-12 | O envio sai por SMTP com `nodemailer`, configurado por host, porta, credenciais e remetente separados. A aplicação não conhece o provedor: o Resend entra como `smtp.resend.com:465` com usuário `resend`      | SDK HTTP do Resend: prende o código ao provedor e obriga a interceptar HTTP nos testes; trocar de provedor viraria troca de dependência em vez de troca de variável     |
| DEC-13 | O envio do e-mail é aguardado dentro da requisição e uma falha do relay resulta em `500`, deixando o problema visível ao cliente em vez de silenciado                                                          | Disparar sem aguardar: iguala melhor o tempo dos dois caminhos, mas esconde falhas de entrega e torna os testes dependentes de espera ativa                             |
| DEC-14 | Os templates são componentes react-email estilizados pelo componente `Tailwind`, que converte as classes em estilos embutidos no momento da renderização — o único formato que os clientes de e-mail respeitam | HTML com tabelas escrito à mão: verboso e frágil entre clientes. Motor de template textual (Handlebars, EJS): não resolve a conversão para estilos embutidos            |
| DEC-15 | O mesmo componente gera as duas partes da mensagem: `render` devolve o HTML e `render(..., { plainText: true })` devolve a alternativa em texto puro, evitando manter dois conteúdos em paralelo               | Enviar apenas HTML: piora a entregabilidade e a leitura em clientes que preferem texto. Escrever o texto puro à mão: duplica o conteúdo e sai de sincronia              |
| DEC-16 | Os controllers implementam `Controller` e não conhecem o Fastify; um adaptador em `src/main/adapters` faz a tradução. Mantém a camada `application` livre de dependências de framework                         | Handlers do Fastify direto como controllers: menos código agora, mas prende a camada de aplicação ao framework HTTP                                                     |
| DEC-17 | As rotas respondem `204 No Content` no sucesso, sem corpo e sem `Set-Cookie`, o que satisfaz CA-32, CA-33 e CA-34 sem inventar um envelope vazio                                                               | `200` com corpo `{}`: obrigaria a definir um envelope sem informação e a manter o padrão de resposta da API sobre um objeto vazio                                       |
| DEC-18 | O orquestrador concentra contêineres, migrações e servidor: sobe tudo no `beforeAll`, derruba no `afterAll` e limpa banco e caixa de entrada no `beforeEach`, sem nenhum gancho global do Vitest               | `globalSetup` compartilhando os contêineres entre arquivos: mais rápido, porém divide a responsabilidade em dois arquivos e sai do fluxo previsto pelo padrão de testes |
| DEC-19 | As mensagens são assertadas pela API HTTP do MailCatcher (`GET /messages`, `GET /messages/:id.html`, `GET /messages/:id.plain`, `DELETE /messages`), com o `SMTPMailer` real e um SMTP de verdade na ponta     | Injetar um `Mailer` falso no orquestrador: deixa o gateway e o template sem cobertura. Interceptar a chamada em processo: deixaria de exercitar o transporte SMTP       |
| DEC-20 | A expiração é exercitada envelhecendo `expires_at` pelo orquestrador, e não com relógio falso                                                                                                                  | `vi.setSystemTime`: o relógio falso afeta o servidor HTTP e o driver do banco no mesmo processo, tornando os testes instáveis                                           |
| DEC-21 | A comparação do token é feita pelo `=` do PostgreSQL sobre `CHAR(32)`, que é sensível a caixa, atendendo CA-22 sem código adicional                                                                            | Coluna `citext` ou `lower(token)`: tornaria a comparação insensível a caixa e aceitaria um token alterado                                                               |
| DEC-22 | Sob o princípio de interface uniforme, a rota de cadastro nomeia o recurso criado: `POST /v1/auth/users`. `auth` é o agrupamento do contexto e `users` é a coleção onde a conta passa a existir                | `POST /v1/auth`: substituição direta do segmento antigo, mas a rota deixa de identificar o que está sendo criado. `POST /v1/auth/sign-up`: usa verbo no caminho         |

## Testes Automatizados

A funcionalidade é o ponto de entrada do produto e concentra decisões de segurança (não vazamento de existência de conta, uso único do token, armazenamento de senha), por isso a estratégia é cobrir todos os critérios de aceitação com testes de integração blackbox a partir das duas rotas HTTP, com PostgreSQL e SMTP reais em contêineres efêmeros.

Cada arquivo de suíte chama `orchestrator.start()` no `beforeAll`, `orchestrator.stop()` no `afterAll` e `orchestrator.reset()` no `beforeEach`, que trunca as tabelas e esvazia a caixa do MailCatcher. Os dados de entrada vêm de construtores com `@faker-js/faker`; as mensagens são lidas pela API HTTP do MailCatcher; asserções sobre estado que a API não expõe (hash da senha, `expires_at`, marcação de verificação) usam os métodos de consulta do orquestrador. O limiar de cobertura configurado no `vitest.config.ts` é de 90% sobre `src`.

| #     | Descrição                                                                                                           | Critérios de aceitação | Resultado esperado                                                                                                        |
| :---- | :------------------------------------------------------------------------------------------------------------------ | :--------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| TU-1  | Cadastro com dados válidos cria a conta                                                                             | CA-1                   | `204`; existe uma linha em `users` com `verified_at` nulo                                                                 |
| TU-2  | Corpo da resposta de cadastro bem-sucedido                                                                          | CA-32                  | `204` e corpo vazio                                                                                                       |
| TU-3  | Cadastro bem-sucedido não abre sessão                                                                               | CA-34                  | Resposta sem `Set-Cookie`, sem `Authorization` e sem qualquer token de acesso                                             |
| TU-4  | Cadastro omitindo `first_name`, `last_name`, `email` e `password`, um de cada vez                                   | CA-2                   | `400` com `errors` apontando o campo ausente; nenhuma linha em `users`                                                    |
| TU-5  | Cadastro com `first_name` de 1 e de 101 caracteres                                                                  | CA-3                   | `400` apontando `#/first_name`; nenhuma linha em `users`                                                                  |
| TU-6  | Cadastro com `last_name` de 1 e de 101 caracteres                                                                   | CA-4                   | `400` apontando `#/last_name`; nenhuma linha em `users`                                                                   |
| TU-7  | Cadastro com senha de 7 e de 65 caracteres                                                                          | CA-5                   | `400` apontando `#/password`; nenhuma linha em `users`                                                                    |
| TU-8  | Cadastro com senha de 8 caracteres só de minúsculas e sem símbolos                                                  | CA-6                   | `204`; a conta é criada                                                                                                   |
| TU-9  | Cadastro com e-mail sem `@`, sem domínio e com espaço interno                                                       | CA-7                   | `400` apontando `#/email`; nenhuma linha em `users`                                                                       |
| TU-10 | Cadastro com nome curto, sobrenome curto, e-mail inválido e senha curta na mesma requisição                         | CA-8                   | `400` com quatro entradas em `errors`, uma por campo                                                                      |
| TU-11 | Cadastro com espaços nas bordas de `first_name`, `last_name` e `email`                                              | CA-9                   | `204`; os valores gravados não contêm espaços nas bordas                                                                  |
| TU-12 | Cadastro com `first_name` e `last_name` compostos apenas por espaços                                                | CA-10                  | `400` por mínimo de 2 caracteres; nenhuma linha em `users`                                                                |
| TU-13 | Cadastro com `first_name` de exatamente 100 caracteres cercado por espaços                                          | CA-11                  | `204`; o valor gravado tem 100 caracteres                                                                                 |
| TU-14 | Cadastro com senha de 8 caracteres contendo espaços nas bordas e com 65 caracteres contando os espaços              | CA-12                  | O primeiro caso responde `204` e o hash gravado confere com a senha original, espaços incluídos; o segundo responde `400` |
| TU-15 | Mensagem de ativação recebida pelo MailCatcher após um cadastro bem-sucedido                                        | CA-13                  | Exatamente uma mensagem na caixa, com um único destinatário: o endereço normalizado do cadastro                           |
| TU-16 | Link contido na mensagem de ativação, nas partes HTML e texto puro                                                  | CA-14                  | As duas partes contêm `https://app.fincheck.com.br/users/verify?token=<token>` com o token gravado na tabela              |
| TU-17 | Tokens de dois cadastros distintos                                                                                  | CA-15                  | Os dois valores diferem, têm 32 caracteres hexadecimais minúsculos e a coluna é única                                     |
| TU-18 | Validade gravada para o token                                                                                       | CA-16                  | `expires_at` é exatamente 15 minutos após `created_at`                                                                    |
| TU-19 | Verificação com token válido dentro da validade                                                                     | CA-17                  | `204`; `verified_at` da conta deixa de ser nulo                                                                           |
| TU-20 | Verificação enviando somente `token`, sem e-mail, senha ou cabeçalho de autenticação                                | CA-18                  | `204`                                                                                                                     |
| TU-21 | Verificação com token inexistente                                                                                   | CA-19                  | `400`; nenhuma conta tem `verified_at` preenchido                                                                         |
| TU-22 | Verificação com token cuja validade foi envelhecida pelo orquestrador                                               | CA-20                  | `400`; `verified_at` permanece nulo                                                                                       |
| TU-23 | Verificação repetindo um token já consumido                                                                         | CA-21                  | A primeira responde `204` e a segunda `400`; a conta permanece verificada                                                 |
| TU-24 | Verificação com o token em caixa alta e com um caractere trocado                                                    | CA-22                  | `400` nos dois casos; `verified_at` permanece nulo                                                                        |
| TU-25 | Verificação com o token de uma entre duas contas não verificadas                                                    | CA-23                  | Apenas a conta dona do token passa a ter `verified_at` preenchido                                                         |
| TU-26 | Cadastro com `Erick+Trabalho@Fincheck.com.br` em base vazia                                                         | CA-24                  | `204`; o e-mail gravado é `erick@fincheck.com.br` e a mensagem vai para esse endereço                                     |
| TU-27 | Cadastro com `er.ick@fincheck.com.br` havendo `erick@fincheck.com.br`                                               | CA-25                  | `204`; passam a existir duas contas com e-mails distintos                                                                 |
| TU-28 | Cadastro repetindo exatamente um e-mail já existente, com nome e senha diferentes                                   | CA-26                  | `204`; continua existindo uma conta e seus dados originais estão inalterados                                              |
| TU-29 | Cadastro com `ERICK@FINCHECK.COM.BR`, `erick+1@fincheck.com.br` e `  erick@fincheck.com.br  ` sobre conta existente | CA-27                  | `204` nos três casos; continua existindo uma única conta                                                                  |
| TU-30 | Caixa do MailCatcher após cadastro com e-mail já existente                                                          | CA-28                  | A contagem de mensagens não muda em relação a antes da requisição                                                         |
| TU-31 | Novo cadastro sobre conta ainda não verificada e uso posterior do token original                                    | CA-29                  | Nenhuma nova mensagem na caixa; existe um único token na tabela e ele continua verificando a conta                        |
| TU-32 | Comparação entre a resposta de um cadastro inédito e a de um cadastro com e-mail existente                          | CA-30                  | Mesmo status, mesmo corpo e mesmos cabeçalhos de conteúdo                                                                 |
| TU-33 | Comparação entre as respostas de token desconhecido, expirado e já utilizado                                        | CA-31                  | Os três têm o mesmo status e o mesmo corpo, incluindo `title` e `detail`                                                  |
| TU-34 | Corpo da resposta de verificação bem-sucedida                                                                       | CA-33                  | `204` e corpo vazio                                                                                                       |
| TU-35 | Verificação bem-sucedida não abre sessão                                                                            | CA-34                  | Resposta sem `Set-Cookie` e sem qualquer credencial                                                                       |
| TU-36 | Verificação omitindo o campo `token` e enviando-o vazio                                                             | CA-35                  | `400` com `errors` apontando `#/token`                                                                                    |

## Fora de Escopo

- Rota de reenvio do link de ativação e emissão de um segundo token para uma conta existente — a modelagem em tabela própria já a acomoda, mas nenhuma rota é entregue aqui;
- Autenticação, emissão de sessão, `Hasher.compare` e qualquer middleware de autorização;
- Rotina de expurgo de tokens expirados e de contas nunca verificadas;
- Limite de tentativas, CAPTCHA, bloqueio por IP e demais defesas contra abuso das duas rotas;
- Mitigação de canal lateral de tempo além da derivação incondicional do hash descrita em DEC-2;
- Fila, retentativa e processamento assíncrono do envio de e-mail; acompanhamento de entrega, abertura e rejeição pelo provedor;
- Configuração de SPF, DKIM, DMARC e do domínio remetente no provedor de e-mail;
- Servidor de pré-visualização do react-email (`react-email dev`) e testes de renderização do template entre clientes de e-mail;
- Tradução dos templates para outros idiomas;
- Observabilidade da funcionalidade: métricas, tracing distribuído, log estruturado e auditoria de acesso;
- Ajuste do `problem` para traduzir erros nativos do Fastify (corpo ausente, `Content-Type` não suportado) em respostas `4xx`;
- Réplicas de leitura, cache, parametrização do pool de conexões por ambiente e uso de PgBouncer;
- Alteração do `ci.yml`: o runner `ubuntu-latest` já dispõe de Docker e executa o Testcontainers com o script `npm run test` existente;
- Migração de dados: as duas tabelas nascem vazias e não há esquema anterior a converter.
