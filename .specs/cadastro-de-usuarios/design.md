# Design: Cadastro de Usuários

## Visão Geral

Esta é a primeira funcionalidade do Fincheck que persiste dados e conversa com um serviço externo, então ela carrega a fundação da aplicação além do próprio cadastro. Serão criadas as camadas `application`, `domain` e `infra` descritas em `folder-standards.md`, a conexão com o PostgreSQL, o versionamento de esquema por migrações SQL, a entrega assíncrona de e-mail por fila e SMTP e a infraestrutura de testes de integração blackbox com banco, broker e servidor de e-mail efêmeros.

Sobre essa base ficam as duas rotas do fluxo: a criação de conta, que recebe primeiro nome, último nome, e-mail e senha, e a confirmação de propriedade do e-mail, que consome o token recebido na caixa de entrada. As duas respondem sem corpo e nunca revelam se um endereço já possui conta, conforme `BUS-03`. O envio de e-mail não acontece no caminho da requisição: o caso de uso publica uma mensagem numa fila do RabbitMQ e um consumidor renderiza o template e entrega ao servidor SMTP, de forma que uma indisponibilidade do provedor não derrube o cadastro nem perca a mensagem. O e-mail é normalizado antes de ser gravado e comparado, a senha é armazenada apenas como hash e o token de ativação é aleatório, de uso único e persistido apenas na forma resumida.

## Variáveis de Ambiente

| Nome                | Formato   | Descrição                                                                                   | Sensível | Status |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------ | :------- | :----- |
| `APP_WEB_URL`       | `string`  | URL base da aplicação web, incluindo protocolo, usada para montar o link de ativação        | ❌       | Novo   |
| `POSTGRES_USER`     | `string`  | Usuário utilizado pela API na conexão com o PostgreSQL                                      | ❌       | Novo   |
| `POSTGRES_PASSWORD` | `string`  | Senha do usuário da conexão com o PostgreSQL                                                | ✅       | Novo   |
| `POSTGRES_HOST`     | `string`  | Host do servidor PostgreSQL                                                                 | ❌       | Novo   |
| `POSTGRES_PORT`     | `number`  | Porta do servidor PostgreSQL                                                                | ❌       | Novo   |
| `POSTGRES_DATABASE` | `string`  | Nome do banco de dados utilizado pela API                                                   | ❌       | Novo   |
| `POSTGRES_SSL`      | `boolean` | Habilita TLS na conexão com o PostgreSQL                                                    | ❌       | Novo   |
| `RABBITMQ_HOST`     | `string`  | Host do broker RabbitMQ                                                                     | ❌       | Novo   |
| `RABBITMQ_PORT`     | `number`  | Porta AMQP do broker RabbitMQ                                                               | ❌       | Novo   |
| `RABBITMQ_USER`     | `string`  | Usuário de autenticação no broker RabbitMQ                                                  | ❌       | Novo   |
| `RABBITMQ_PASSWORD` | `string`  | Senha de autenticação no broker RabbitMQ                                                    | ✅       | Novo   |
| `RABBITMQ_VHOST`    | `string`  | Virtual host usado pela aplicação no broker RabbitMQ                                        | ❌       | Novo   |
| `SMTP_HOST`         | `string`  | Host do servidor SMTP do provedor de e-mail                                                 | ❌       | Novo   |
| `SMTP_PORT`         | `number`  | Porta do servidor SMTP                                                                      | ❌       | Novo   |
| `SMTP_SECURE`       | `boolean` | Indica se a conexão SMTP abre já sob TLS implícito (porta 465) ou usa `STARTTLS`            | ❌       | Novo   |
| `SMTP_USER`         | `string`  | Usuário de autenticação no servidor SMTP; vazio desabilita a autenticação                   | ❌       | Novo   |
| `SMTP_PASSWORD`     | `string`  | Senha de autenticação no servidor SMTP                                                      | ✅       | Novo   |
| `MAIL_FROM_ADDRESS` | `string`  | Endereço remetente dos e-mails transacionais, conforme `BUS-08` (`noreply@fincheck.com.br`) | ❌       | Novo   |
| `MAIL_FROM_NAME`    | `string`  | Nome de exibição do remetente dos e-mails transacionais                                     | ❌       | Novo   |

## Arquivos

| Caminho                                                                  | Camada        | Descrição                                                                                                                               | Status   |
| :----------------------------------------------------------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `src/common/core/config.ts`                                              | `common`      | Passa a validar e expor os grupos `postgres`, `rabbitmq`, `smtp`, `mail` e a URL da aplicação web                                       | Alterado |
| `src/common/http/statuses.ts`                                            | `common`      | Adiciona `NoContent` e `UnprocessableContent`, usados pelas respostas de sucesso e pelo erro de token                                   | Alterado |
| `src/common/http/problem.ts`                                             | `common`      | Exporta o tipo `Details` e ganha a fábrica pública `create` para disparar erros conhecidos sem criar classes de erro customizadas       | Alterado |
| `src/common/http/controller.ts`                                          | `common`      | Declara `HTTPRequest`, `HTTPResponse` e `Controller`, permitindo que controllers não conheçam o Fastify                                 | Novo     |
| `src/domain/value-objects/email.ts`                                      | `domain`      | Normaliza (aparo de espaços e caixa baixa) e valida o endereço de e-mail, garantindo `BUS-02`                                           | Novo     |
| `src/domain/entities/user.ts`                                            | `domain`      | Entidade de usuário, geradora do ULID, dos metadados e da transição para conta ativada                                                  | Novo     |
| `src/domain/entities/activation.ts`                                      | `domain`      | Entidade de ativação, geradora do token aleatório, do resumo persistido, da validade de 15 minutos e do consumo único                   | Novo     |
| `src/domain/repositories/user.ts`                                        | `domain`      | Interface de acesso a dados de usuários                                                                                                 | Novo     |
| `src/domain/repositories/activation.ts`                                  | `domain`      | Interface de acesso a dados de ativações                                                                                                | Novo     |
| `src/application/interfaces/transaction.ts`                              | `application` | Interface de um método que delimita uma transação explícita, sem entregar repositórios                                                  | Novo     |
| `src/application/interfaces/password-hasher.ts`                          | `application` | Interface do gerador de hash de senha                                                                                                   | Novo     |
| `src/application/interfaces/mailer.ts`                                   | `application` | Interface única de e-mail, com um método por mensagem transacional, mantendo template e transporte fora do caso de uso                  | Novo     |
| `src/application/usecases/auth/create-user.ts`                           | `application` | Caso de uso de cadastro: normaliza, gera hash, grava usuário e ativação em transação e dispara o e-mail                                 | Novo     |
| `src/application/usecases/auth/activate-user.ts`                         | `application` | Caso de uso de ativação: valida o token, consome a ativação e ativa a conta em transação                                                | Novo     |
| `src/application/controllers/users/create-user.ts`                       | `application` | Valida o corpo do cadastro com Zod e traduz as chaves `snake_case` para a entrada do caso de uso                                        | Novo     |
| `src/application/controllers/users/activate-user.ts`                     | `application` | Valida o corpo da ativação com Zod e aciona o caso de uso                                                                               | Novo     |
| `src/infra/database/postgres/connection.ts`                              | `infra`       | Cria e encerra o pool de conexões a partir da configuração                                                                              | Novo     |
| `src/infra/database/postgres/context.ts`                                 | `infra`       | Mantém o cliente da transação corrente num `AsyncLocalStorage` e o resolve para os repositórios, caindo no pool quando não há uma       | Novo     |
| `src/infra/database/postgres/transaction.ts`                             | `infra`       | Implementa a transação explícita (`BEGIN`/`COMMIT`/`ROLLBACK`) e a publica no contexto; chamada aninhada entra na transação corrente    | Novo     |
| `src/infra/database/postgres/repositories/user.ts`                       | `infra`       | Implementa o repositório de usuários, incluindo a inserção idempotente por conflito de e-mail                                           | Novo     |
| `src/infra/database/postgres/repositories/activation.ts`                 | `infra`       | Implementa o repositório de ativações, incluindo a leitura com bloqueio de linha                                                        | Novo     |
| `src/infra/database/migrator.ts`                                         | `infra`       | Executa as migrações via API programática do `node-pg-migrate`, reutilizada pelo script de CLI e pelo orquestrador de testes            | Novo     |
| `src/infra/database/migrations/*_create_users.up.sql`                    | `infra`       | Cria a tabela `users`, seu índice único de e-mail e a restrição de caixa baixa                                                          | Novo     |
| `src/infra/database/migrations/*_create_users.down.sql`                  | `infra`       | Reverte a criação da tabela `users`                                                                                                     | Novo     |
| `src/infra/database/migrations/*_create_user_activation_tokens.up.sql`   | `infra`       | Cria a tabela `user_activation_tokens` e seus índices                                                                                   | Novo     |
| `src/infra/database/migrations/*_create_user_activation_tokens.down.sql` | `infra`       | Reverte a criação da tabela `user_activation_tokens`                                                                                    | Novo     |
| `src/infra/security/password-hasher.ts`                                  | `infra`       | Implementa o hash de senha com argon2id                                                                                                 | Novo     |
| `src/infra/queue/messages.ts`                                            | `infra`       | Tipos e schema Zod das mensagens de e-mail, contrato entre o produtor e o consumidor                                                    | Novo     |
| `src/infra/queue/rabbitmq/topology.ts`                                   | `infra`       | Declara exchanges, filas, ligações e política de retentativa de forma idempotente na subida da aplicação                                | Novo     |
| `src/infra/queue/rabbitmq/connection.ts`                                 | `infra`       | Abre a conexão e os canais com reconexão automática e os encerra no desligamento                                                        | Novo     |
| `src/infra/queue/rabbitmq/publisher.ts`                                  | `infra`       | Publica mensagens persistentes em canal de confirmação, resolvendo apenas após o `ack` do broker                                        | Novo     |
| `src/infra/queue/rabbitmq/consumer.ts`                                   | `infra`       | Laço de consumo: valida a mensagem, delega ao handler, confirma em caso de sucesso e encaminha para retentativa ou fila morta           | Novo     |
| `src/infra/email/transport.ts`                                           | `infra`       | Cria o transporte SMTP com pool a partir da configuração e o encerra no desligamento da aplicação                                       | Novo     |
| `src/infra/email/queued-mailer.ts`                                       | `infra`       | Implementa `Mailer` publicando a intenção de envio na fila, sem tocar no SMTP                                                           | Novo     |
| `src/infra/email/dispatcher.ts`                                          | `infra`       | Handler do consumidor: escolhe o template pelo tipo da mensagem, renderiza e entrega ao transporte SMTP                                 | Novo     |
| `src/infra/email/templates/layout.tsx`                                   | `infra`       | Casca comum dos e-mails com o provedor do Tailwind, cabeçalho, rodapé e aviso de caixa não monitorada                                   | Novo     |
| `src/infra/email/templates/activation.tsx`                               | `infra`       | Template do e-mail de ativação, que monta o link com `APP_WEB_URL` e o token                                                            | Novo     |
| `src/infra/docker/compose.yml`                                           | `infra`       | Sobe o PostgreSQL, o RabbitMQ e o MailCatcher para desenvolvimento local                                                                | Novo     |
| `src/main/adapters/controller.ts`                                        | `main`        | Adapta um `Controller` para um handler do Fastify, isolando o framework da camada `application`                                         | Novo     |
| `src/main/router.ts`                                                     | `main`        | Declara as rotas `POST /v1/users` e `POST /v1/users/activations`                                                                        | Novo     |
| `src/main/app.ts`                                                        | `main`        | Instancia pool, broker, repositórios, gateways e casos de uso, registra rotas, sobe o consumidor e encerra tudo no `stop`               | Alterado |
| `tests/setup/orchestrator.ts`                                            | `tests`       | Sobe PostgreSQL, RabbitMQ e MailCatcher efêmeros, roda migrações, inicia/para o servidor, limpa os três entre casos e expõe utilitários | Novo     |
| `tests/setup/mailcatcher.ts`                                             | `tests`       | Cliente da API HTTP do MailCatcher: lista mensagens, lê corpos e limpa a caixa entre testes                                             | Novo     |
| `tests/integration/api/users/create-user.spec.ts`                        | `tests`       | Testes blackbox de `POST /v1/users`                                                                                                     | Novo     |
| `tests/integration/api/users/activation.spec.ts`                         | `tests`       | Testes blackbox de `POST /v1/users/activations`                                                                                         | Novo     |
| `tests/integration/api/users/email-outage.spec.ts`                       | `tests`       | Suíte isolada que derruba o servidor SMTP na subida para exercitar a retenção da mensagem na fila                                       | Novo     |
| `tsconfig.json`                                                          | -             | Adiciona os apelidos `@application/*`, `@domain/*`, `@infra/*` e `@tests/*` e habilita `jsx` no modo `react-jsx` para os templates      | Alterado |
| `vitest.config.ts`                                                       | -             | Habilita cobertura com limite mínimo de 90% e amplia o tempo dos hooks por causa do contêiner                                           | Alterado |
| `package.json`                                                           | -             | Adiciona as dependências e os scripts `db:migrate` e `db:migrate:create`                                                                | Alterado |
| `.env.example`                                                           | -             | Documenta as novas variáveis de ambiente                                                                                                | Alterado |
| `.env.test`                                                              | -             | Define os valores das novas variáveis no ambiente de testes                                                                             | Alterado |

## Contratos

### `Controller` - `src/common/http/controller.ts`

```ts
type HTTPRequest = {
  body: unknown
  params: unknown
  query: unknown
}

type HTTPResponse = {
  body?: unknown
  status: StatusCode
}

interface Controller {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
```

### `UserRepository` - `src/domain/repositories/user.ts`

```ts
interface UserRepository {
  create(user: User): Promise<boolean>
  findById(id: string): Promise<User | null>
  update(user: User): Promise<void>
}
```

> `create` resolve para `false` quando o e-mail já pertence a outro usuário, sem lançar erro, sustentando `BUS-03`.

### `ActivationRepository` - `src/domain/repositories/activation.ts`

```ts
interface ActivationRepository {
  create(activation: Activation): Promise<void>
  findByTokenHash(tokenHash: string): Promise<Activation | null>
  update(activation: Activation): Promise<void>
}
```

> `findByTokenHash` bloqueia a linha encontrada até o fim da transação, impedindo consumo simultâneo do mesmo token.

### `Transaction` - `src/application/interfaces/transaction.ts`

```ts
interface Transaction {
  run<T>(handler: () => Promise<T>): Promise<T>
}
```

> Delimita a transação sem entregar repositórios: o caso de uso recebe no construtor apenas os repositórios que usa. Tudo que rodar dentro do `handler`, em qualquer profundidade da pilha de `await`, participa da mesma transação. Uma chamada de `run` dentro de outra entra na transação corrente em vez de abrir uma nova, e leituras feitas fora de qualquer `run` usam o pool diretamente.

### `PasswordHasher` - `src/application/interfaces/password-hasher.ts`

```ts
interface PasswordHasher {
  hash(password: string): Promise<string>
}
```

### `Mailer` - `src/application/interfaces/mailer.ts`

```ts
type ActivationMail = {
  firstName: string
  recipient: string
  token: string
}

interface Mailer {
  sendActivation(mail: ActivationMail): Promise<void>
}
```

> Interface única para todo e-mail transacional, com um método por mensagem. Cada nova mensagem do produto entra como um método aqui, e não como uma interface nova.

### `EmailMessage` - `src/infra/queue/messages.ts`

```ts
type EmailMessage = {
  payload: ActivationMail
  type: 'activation'
}
```

> Contrato entre produtor e consumidor, validado por schema Zod na entrada do consumidor. A união cresce por `type` conforme novas mensagens surgem. A fila carrega a intenção de envio, nunca o HTML já renderizado.

### `EmailDispatcher` - `src/infra/email/dispatcher.ts`

```ts
interface EmailDispatcher {
  dispatch(message: EmailMessage): Promise<void>
}
```

### Topologia da fila - `src/infra/queue/rabbitmq/topology.ts`

| Recurso                 | Tipo       | Descrição                                                                                                |
| :---------------------- | :--------- | :------------------------------------------------------------------------------------------------------- |
| `fincheck.emails`       | `exchange` | Exchange direta e durável que recebe as publicações do `QueuedMailer`                                    |
| `emails.outgoing`       | `queue`    | Fila durável ligada a `fincheck.emails` pela chave `send`, consumida pelo despachante                    |
| `fincheck.emails.retry` | `exchange` | Exchange durável para onde a mensagem é encaminhada quando o envio falha                                 |
| `emails.retry`          | `queue`    | Fila durável com `x-message-ttl` de 30 segundos que devolve a mensagem para `fincheck.emails` ao expirar |
| `emails.dead`           | `queue`    | Fila durável que recebe mensagens inválidas e as que esgotaram o teto de 5 tentativas                    |

> A retentativa usa o mecanismo nativo de dead lettering: falha no envio gera `nack` sem reenfileiramento, a mensagem cai em `emails.retry`, espera o TTL e volta para a fila principal. A contagem de tentativas sai do cabeçalho `x-death`.

### `Email` - `src/domain/value-objects/email.ts`

```ts
class Email {
  public readonly value: string

  public static create(value: string): Email
  public toString(): string
}
```

### `User` - `src/domain/entities/user.ts`

```ts
type UserProperties = {
  email: Email
  firstName: string
  lastName: string
  passwordHash: string
}

class User {
  public readonly id: string
  public readonly email: Email
  public readonly firstName: string
  public isActivated: boolean
  public readonly lastName: string
  public readonly passwordHash: string
  public readonly createdAt: Date
  public updatedAt: Date

  public activate(): void
  public static create(properties: UserProperties): User
  public static restore(properties: UserProperties & Metadata): User
}
```

### `Activation` - `src/domain/entities/activation.ts`

```ts
type IssuedActivation = {
  activation: Activation
  token: string
}

class Activation {
  public readonly id: string
  public readonly userId: string
  public consumedAt: Date | null
  public readonly expiresAt: Date
  public readonly tokenHash: string
  public readonly createdAt: Date

  public consume(): void
  public isPending(reference: Date): boolean
  public static hashToken(token: string): string
  public static issue(userId: string): IssuedActivation
  public static restore(properties: ActivationProperties): Activation
}
```

> `issue` devolve o token em claro apenas em memória; a entidade persiste somente `tokenHash`.

## Rotas

| Método | Caminho                 | Descrição                                                          | Status |
| :----- | :---------------------- | :----------------------------------------------------------------- | :----- |
| `POST` | `/v1/users`             | Cria uma conta não ativada e envia o e-mail com o link de ativação | Novo   |
| `POST` | `/v1/users/activations` | Consome um token de ativação e marca a conta como ativada          | Novo   |

---

### `POST /v1/users`

Cria um usuário em estado não ativado e envia o e-mail de ativação. Quando o e-mail já pertence a uma conta existente, a resposta é idêntica à de sucesso e nada é criado ou enviado.

#### Parâmetros de rota

Não se aplica.

#### Parâmetros de consulta

Não se aplica.

#### Corpo

```json
{
  "first_name": "Tifa",
  "last_name": "Lockhart",
  "email": "tifa.lockhart@gmail.com",
  "password": "m1dg4r 1s 4ws0m3"
}
```

| Nome         | Tipo     | Padrão | Regras                                                                   |
| :----------- | :------- | :----- | :----------------------------------------------------------------------- |
| `first_name` | `string` | `-`    | `Obrigatório, aparado, de 1 a 100 caracteres`                            |
| `last_name`  | `string` | `-`    | `Obrigatório, aparado, de 1 a 100 caracteres`                            |
| `email`      | `string` | `-`    | `Obrigatório, formato de e-mail válido, até 254 caracteres, normalizado` |
| `password`   | `string` | `-`    | `Obrigatório, de 8 a 64 caracteres, sem exigência de complexidade`       |

#### Respostas

| Status | Tipo        | Quando                                                                                 |
| :----- | :---------- | :------------------------------------------------------------------------------------- |
| `204`  | `sem corpo` | `Usuário criado e e-mail enviado, ou e-mail já cadastrado (respostas indistinguíveis)` |
| `400`  | `Problem`   | `Corpo fora do schema, com um ponteiro por campo inválido`                             |
| `500`  | `Problem`   | `Falha ao gravar no banco ou ao publicar a mensagem na fila`                           |

---

### `POST /v1/users/activations`

Consome o token recebido por e-mail e marca a conta como ativada. Token inexistente, expirado ou já consumido produzem a mesma resposta.

#### Parâmetros de rota

Não se aplica.

#### Parâmetros de consulta

Não se aplica.

#### Corpo

```json
{
  "token": "n0xM9WlYb1pQZ0F1c2VyQWN0aXZhdGlvblRva2Vu"
}
```

| Nome    | Tipo     | Padrão | Regras                              |
| :------ | :------- | :----- | :---------------------------------- |
| `token` | `string` | `-`    | `Obrigatório, ao menos 1 caractere` |

#### Respostas

| Status | Tipo        | Quando                                                                          |
| :----- | :---------- | :------------------------------------------------------------------------------ |
| `204`  | `sem corpo` | `Token válido, dentro da validade e ainda não consumido; conta passa a ativada` |
| `400`  | `Problem`   | `Corpo fora do schema, com ponteiro para o campo token`                         |
| `422`  | `Problem`   | `Token inexistente, expirado ou já consumido, com mensagem genérica`            |
| `500`  | `Problem`   | `Falha ao acessar o banco de dados`                                             |

## Banco de Dados

### `public`.`users`

#### Colunas

| Nome            | Tipo           | Obrigatória | Descrição                                                          | Status |
| :-------------- | :------------- | :---------- | :----------------------------------------------------------------- | :----- |
| `id`            | `CHAR(26)`     | ✅          | ULID gerado na entidade de domínio, chave primária                 | Novo   |
| `email`         | `VARCHAR(254)` | ✅          | Endereço de e-mail já normalizado em caixa baixa                   | Novo   |
| `first_name`    | `VARCHAR(100)` | ✅          | Primeiro nome informado no cadastro                                | Novo   |
| `is_activated`  | `BOOLEAN`      | ✅          | Indica se a propriedade do e-mail já foi confirmada                | Novo   |
| `last_name`     | `VARCHAR(100)` | ✅          | Último nome informado no cadastro                                  | Novo   |
| `password_hash` | `TEXT`         | ✅          | Hash argon2id da senha, incluindo parâmetros e sal                 | Novo   |
| `created_at`    | `TIMESTAMPTZ`  | ✅          | Momento da criação, em UTC, gerado na entidade de domínio          | Novo   |
| `updated_at`    | `TIMESTAMPTZ`  | ✅          | Momento da última alteração, em UTC, gerado na entidade de domínio | Novo   |

#### Índices

| Nome                    | Tipo      | Descrição                                                                  | Status |
| :---------------------- | :-------- | :------------------------------------------------------------------------- | :----- |
| `users_pkey`            | `PRIMARY` | Chave primária sobre `id`                                                  | Novo   |
| `users_email_key`       | `UNIQUE`  | Garante `BUS-01` e sustenta a inserção idempotente por conflito            | Novo   |
| `users_email_lowercase` | `CHECK`   | Exige `email = lower(email)`, protegendo a invariante de `BUS-02` no banco | Novo   |

### `public`.`user_activation_tokens`

#### Colunas

| Nome          | Tipo          | Obrigatória | Descrição                                                         | Status |
| :------------ | :------------ | :---------- | :---------------------------------------------------------------- | :----- |
| `id`          | `CHAR(26)`    | ✅          | ULID gerado na entidade de domínio, chave primária                | Novo   |
| `user_fk`     | `CHAR(26)`    | ✅          | Referência ao usuário dono da ativação, com remoção em cascata    | Novo   |
| `consumed_at` | `TIMESTAMPTZ` | ❌          | Momento em que o token foi usado; nulo enquanto pendente          | Novo   |
| `expires_at`  | `TIMESTAMPTZ` | ✅          | Momento em que o token perde a validade (criação mais 15 minutos) | Novo   |
| `token_hash`  | `CHAR(64)`    | ✅          | SHA-256 em hexadecimal do token enviado por e-mail                | Novo   |
| `created_at`  | `TIMESTAMPTZ` | ✅          | Momento da emissão, em UTC, gerado na entidade de domínio         | Novo   |

#### Índices

| Nome                                    | Tipo      | Descrição                                                         | Status |
| :-------------------------------------- | :-------- | :---------------------------------------------------------------- | :----- |
| `user_activation_tokens_pkey`           | `PRIMARY` | Chave primária sobre `id`                                         | Novo   |
| `user_activation_tokens_token_hash_key` | `UNIQUE`  | Impede colisão de resumos e serve de caminho de busca da ativação | Novo   |
| `user_activation_tokens_user_fk_fkey`   | `FOREIGN` | Referencia `users(id)` com `ON DELETE CASCADE`                    | Novo   |
| `user_activation_tokens_user_fk_idx`    | `BTREE`   | Acelera a busca das ativações de um usuário                       | Novo   |

## Dependências

| Pacote                       | Produção | Versão    | Justificativa                                                                                                        |
| :--------------------------- | :------- | :-------- | :------------------------------------------------------------------------------------------------------------------- |
| `pg`                         | ✅       | `8.23.0`  | Driver PostgreSQL com pool e controle manual de transação, exigido como par pelo `node-pg-migrate`                   |
| `node-pg-migrate`            | ✅       | `9.0.0`   | Migrações versionadas em arquivos `.sql`, com prefixo de timestamp automático e API programática                     |
| `@node-rs/argon2`            | ✅       | `2.1.0`   | Hash argon2id com binários pré-compilados, compatível com o `ignore-scripts = true` do `.npmrc`                      |
| `nodemailer`                 | ✅       | `8.0.11`  | Cliente SMTP maduro do ecossistema Node.js, com pool de conexões e montagem de mensagem multipart                    |
| `amqplib`                    | ✅       | `2.0.1`   | Cliente AMQP oficial; a linha 2 traz tipagem própria, zero dependências, canal de confirmação e reconexão automática |
| `@react-email/components`    | ✅       | `1.0.12`  | Componentes de e-mail, o `Tailwind` e a função `render`; carrega o `tailwindcss` v4 de forma transitiva              |
| `react`                      | ✅       | `19.2.8`  | Par obrigatório dos componentes de e-mail                                                                            |
| `react-dom`                  | ✅       | `19.2.8`  | Par obrigatório da renderização para HTML e para texto puro                                                          |
| `ulid`                       | ✅       | `3.0.2`   | Geração dos identificadores das entidades, conforme `code-standards.md`                                              |
| `@types/pg`                  | ❌       | `8.21.0`  | Tipagem do driver; versões mais recentes ainda estão em quarentena pelo `.npmrc`                                     |
| `testcontainers`             | ❌       | `12.1.0`  | Ciclo de vida dos contêineres usados pelo orquestrador de testes                                                     |
| `@testcontainers/postgresql` | ❌       | `12.1.0`  | Contêiner de PostgreSQL efêmero por execução de suíte                                                                |
| `@faker-js/faker`            | ❌       | `10.6.0`  | Geração de dados de entrada aleatórios nos testes, conforme `testing-standards.md`                                   |
| `@types/nodemailer`          | ❌       | `8.0.1`   | Tipagem do cliente SMTP, que não distribui declarações próprias; major alinhado ao do `nodemailer`                   |
| `@types/react`               | ❌       | `19.2.18` | Tipagem do JSX usado nos templates                                                                                   |
| `@types/react-dom`           | ❌       | `19.2.4`  | Tipagem exigida na resolução dos tipos da renderização para HTML                                                     |
| `@testcontainers/rabbitmq`   | ❌       | `12.1.0`  | Broker efêmero por execução de suíte                                                                                 |
| `@vitest/coverage-v8`        | ❌       | `4.1.10`  | Medição e imposição do mínimo de 90% de cobertura; versão alinhada ao `vitest` já instalado                          |

## Decisões

| #      | Justificativa                                                                                                                                                                                                                              | Alternativas                                                                                                                                                                                          |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-01 | Usar `pg` como único driver, já que o `node-pg-migrate` o exige como dependência par; manter dois drivers no projeto duplicaria configuração de conexão sem ganho                                                                          | `postgres` (porsager) com outra ferramenta de migração; ORM como Drizzle ou Prisma, que traria geração de esquema e camada de query desnecessárias                                                    |
| DEC-02 | Migrações escritas em `.sql` puro com o `node-pg-migrate`, cuja API programática é reaproveitada tanto pelo script de CLI quanto pelo orquestrador de testes                                                                               | Migrações em TypeScript com o construtor da própria biblioteca; `dbmate` ou `golang-migrate`, que exigiriam binário externo no CI                                                                     |
| DEC-03 | Hash de senha com `@node-rs/argon2` (argon2id), que distribui binários pré-compilados e por isso funciona com `ignore-scripts = true`                                                                                                      | `argon2`, que compila via `node-gyp` e quebra com scripts desabilitados; `crypto.scrypt` da stdlib, sem dependência mas com menor resistência a GPU                                                   |
| DEC-04 | Token de ativação com 32 bytes aleatórios de `crypto.randomBytes` codificados em `base64url`, persistindo apenas o SHA-256; um vazamento do banco não produz tokens utilizáveis                                                            | Guardar o token em claro; usar ULID ou UUID como token, com entropia menor e parcialmente previsível; JWT assinado, que exigiria estado mesmo assim                                                   |
| DEC-05 | Ativações em tabela própria (`user_activation_tokens`), o que preserva histórico de emissões e isola o consumo único da entidade de usuário                                                                                                | Colunas de token diretamente em `users`, que impede histórico e mistura ciclos de vida distintos                                                                                                      |
| DEC-06 | Inserção do usuário com `INSERT ... ON CONFLICT (email) DO NOTHING RETURNING id`, tratando ausência de retorno como e-mail já cadastrado; é atômico e não usa exceção para fluxo esperado                                                  | `SELECT` prévio de existência, sujeito a corrida entre duas requisições simultâneas; capturar o erro `23505` do PostgreSQL, usando exceção como fluxo                                                 |
| DEC-07 | Gerar o hash da senha antes de saber se o e-mail já existe, para que o caminho do e-mail duplicado tenha custo de tempo semelhante ao do cadastro novo e não vire um oráculo por temporização                                              | Checar a existência primeiro e responder cedo, mais rápido, porém mensurável por um atacante                                                                                                          |
| DEC-08 | Separar a delimitação da transação da entrega de repositórios: `Transaction` marca a fronteira e os repositórios chegam por injeção normal, de modo que cada caso de uso declara só o que usa e a interface não cresce a cada recurso novo | `UnitOfWork` entregando um registro com todos os repositórios, que vira catálogo do sistema inteiro e não define leitura fora de transação; repositório de agregado gravando as duas tabelas          |
| DEC-09 | Publicar a mensagem de e-mail somente após o commit, evitando manter a transação aberta durante I/O externo e evitando anunciar um cadastro que pode ser revertido                                                                         | Publicar dentro da transação; gravar numa tabela de saída (outbox) lida por um processo à parte, tratado em `DEC-20`                                                                                  |
| DEC-10 | Responder `422` para token inválido, expirado ou consumido, reservando `400` para falha de schema; a mensagem é a mesma nos três casos, conforme `BUS-05`                                                                                  | Usar `400` para tudo, perdendo a distinção entre erro de formato e de regra; usar `404`, que revelaria a existência do token                                                                          |
| DEC-11 | Receber o token no corpo do `POST /v1/users/activations` em vez da query string, para que ele não seja registrado em logs de acesso nem propagado por `Referer`                                                                            | `GET /v1/users/activations?token=...`, que exporia o token e alteraria estado em um método seguro                                                                                                     |
| DEC-12 | Adaptador Fastify para `Controller` na camada `main`, mantendo `application` sem dependência do framework HTTP, conforme `folder-standards.md`                                                                                             | Controllers recebendo `FastifyRequest` e `FastifyReply` diretamente, violando as regras de importação entre camadas                                                                                   |
| DEC-13 | Guardar `is_activated` como booleano, espelhando a linguagem do PRD; o momento da ativação continua registrado em `updated_at`                                                                                                             | Coluna `activated_at` com timestamp, que carrega mais informação mas exige derivar a flag em toda leitura                                                                                             |
| DEC-14 | Normalizar o e-mail no objeto de valor e reforçar a invariante com um `CHECK` no banco, mantendo o dado gravado igual ao dado comparado                                                                                                    | Extensão `citext`, que resolveria a comparação mas manteria a capitalização original armazenada e adicionaria uma extensão ao banco                                                                   |
| DEC-15 | Falar com o provedor de `ENG-01` por SMTP, e não pelo SDK HTTP dele, o que mantém o provedor substituível por qualquer serviço de e-mail e permite apontar o mesmo código para um servidor local                                           | SDK oficial do provedor, que amarraria o gateway a uma API proprietária e exigiria dublagem no nível HTTP nos testes                                                                                  |
| DEC-16 | Interceptar os envios nos testes com um MailCatcher efêmero, assertando pela API HTTP dele; o caminho exercitado vai do caso de uso à entrega SMTP, passando pela fila e pela renderização                                                 | Injetar um `Mailer` falso, que deixaria fila, template e transporte sem cobertura; usar o `jsonTransport` do `nodemailer`, que pularia o SMTP                                                         |
| DEC-17 | PostgreSQL, RabbitMQ e MailCatcher efêmeros por suíte via Testcontainers, com migrações pelo orquestrador e limpeza de banco, filas e caixa de e-mail no `beforeEach`                                                                      | Serviços locais compartilhados, frágeis no CI e dependentes de estado anterior; serviços do GitHub Actions, que não funcionariam em execução local                                                    |
| DEC-18 | Tirar o envio de e-mail do caminho da requisição, publicando numa fila durável do RabbitMQ consumida por um despachante; uma queda do provedor deixa de derrubar o cadastro e de perder mensagens                                          | Enviar de forma síncrona, acoplando a resposta à disponibilidade do SMTP; disparar sem esperar, o que perderia a mensagem em qualquer falha                                                           |
| DEC-19 | Publicar a intenção de envio (`type` mais `payload`) em vez do HTML já renderizado, mantendo a mensagem pequena, o template versionado junto do consumidor e a retentativa sempre com o conteúdo atual                                     | Publicar assunto, HTML e texto prontos, o que duplicaria a montagem no produtor e congelaria o template no momento da publicação                                                                      |
| DEC-20 | Aceitar a janela entre o commit e a publicação, mitigada por canal de confirmação e fila durável; o PRD não prevê reenvio, então uma falha rara de publicação deixa a conta sem e-mail                                                     | Outbox transacional, que fecharia a janela ao custo de uma tabela e de um processo de leitura, e é o caminho recomendado quando houver reenvio                                                        |
| DEC-21 | Retentativa por dead lettering nativo, com fila de espera com TTL de 30 segundos, teto de 5 tentativas lido do cabeçalho `x-death` e fila morta ao fim                                                                                     | Reenfileirar na hora, que gera laço apertado enquanto o provedor estiver fora; plugin de mensagem atrasada, que exige instalação no broker                                                            |
| DEC-22 | Rodar o consumidor no mesmo processo da API, já que o isolamento buscado é temporal e não de processo; o despachante é uma classe independente, o que permite extrair um segundo ponto de entrada depois                                   | Processo e implantação separados desde já, que dobrariam a superfície operacional sem necessidade neste estágio                                                                                       |
| DEC-23 | `amqplib` na linha 2, que passou a distribuir tipagem própria, sem dependências transitivas, com canal de confirmação e reconexão automática embutidos                                                                                     | `rabbitmq-client`, de API mais alta mas menos difundida; usar a API HTTP de gerenciamento, inadequada para consumo                                                                                    |
| DEC-24 | Templates em React Email com o componente `Tailwind`, que converte as classes em estilos inline no momento da renderização e resolve a incompatibilidade dos clientes de e-mail com CSS externo                                            | HTML escrito à mão com estilos inline, verboso e sem componentes reutilizáveis; MJML, que traria uma linguagem de template à parte                                                                    |
| DEC-25 | Gerar HTML e texto puro da mesma árvore de componentes, com `render` e a opção `plainText`, mantendo as duas versões sempre em acordo                                                                                                      | Manter um arquivo de texto puro em paralelo, que sai de sincronia com o HTML na primeira alteração                                                                                                    |
| DEC-26 | Resolver o cliente da transação por `AsyncLocalStorage`, com queda para o pool quando não há transação aberta; leitura avulsa dispensa cerimônia e o aninhamento participa da transação corrente                                           | Passar um contexto de transação como parâmetro de cada método de repositório, o que empurra tipo de infraestrutura para as assinaturas em `domain/repositories` e adiciona um parâmetro a todo método |

## Testes Automatizados

O cadastro é a porta de entrada do produto e concentra dados sensíveis, então a estratégia cobre os dois fluxos ponta a ponta a partir das rotas HTTP, com banco, broker e servidor SMTP reais em contêiner. Não há testes unitários: as asserções sobre estado consultam o banco por utilitários do orquestrador, e as asserções sobre e-mail consultam a API HTTP do MailCatcher (`GET /messages`, `GET /messages/:id.html`), com `DELETE /messages` esvaziando a caixa entre os casos. O orquestrador sobe a imagem `sj26/mailcatcher` com `GenericContainer`, aponta `SMTP_HOST` e `SMTP_PORT` para a porta SMTP mapeada (`1025`) e usa a porta web mapeada (`1080`) para as asserções.

Como a entrega passou a ser assíncrona, o orquestrador expõe um utilitário que aguarda a chegada da mensagem na caixa por sondagem com prazo máximo, em vez de espera fixa: o teste bloqueia até a condição acontecer e falha por tempo esgotado se ela não acontecer. Os casos que exigem ausência de e-mail comparam o total de mensagens na caixa depois de drenar a fila. O caso de indisponibilidade do provedor vive numa suíte própria, que para o contêiner do MailCatcher logo após a subida e observa a profundidade da fila de espera pelo próprio canal AMQP, sem precisar religar o serviço. O limite mínimo de cobertura é de 90%.

| #     | Descrição                                                            | Critérios de aceitação | Resultado esperado                                                                                                     |
| :---- | :------------------------------------------------------------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| TU-01 | Cadastro com dados válidos                                           | CA-01                  | `204` com corpo vazio                                                                                                  |
| TU-02 | Estado do usuário logo após o cadastro                               | CA-02                  | Registro gravado com `is_activated` igual a falso                                                                      |
| TU-03 | Cadastro sem nenhum dos quatro campos obrigatórios                   | CA-03                  | `400` com um ponteiro por campo ausente e nenhum usuário gravado                                                       |
| TU-04 | Primeiro nome vazio e primeiro nome com 101 caracteres               | CA-04                  | `400` apontando `#/first_name` e nenhum usuário gravado                                                                |
| TU-05 | Último nome vazio e último nome com 101 caracteres                   | CA-04                  | `400` apontando `#/last_name` e nenhum usuário gravado                                                                 |
| TU-06 | E-mail em formato inválido                                           | CA-05                  | `400` apontando `#/email` e nenhum usuário gravado                                                                     |
| TU-07 | Senha com 7 caracteres e senha com 65 caracteres                     | CA-06                  | `400` apontando `#/password` e nenhum usuário gravado                                                                  |
| TU-08 | Mensagem gerada pelo cadastro bem-sucedido                           | CA-07                  | Uma mensagem na caixa, remetente `noreply@fincheck.com.br` e link `<APP_WEB_URL>/auth/users/activations?token=<token>` |
| TU-09 | Dois cadastros distintos em sequência                                | CA-08                  | Duas mensagens na caixa, com tokens diferentes entre si                                                                |
| TU-10 | Ativação com token válido e ainda não usado                          | CA-09                  | `204` com corpo vazio e `is_activated` igual a verdadeiro                                                              |
| TU-11 | Ativação com token inexistente                                       | CA-10                  | `422` com o erro genérico e nenhuma conta ativada                                                                      |
| TU-12 | Ativação com token cuja validade já venceu                           | CA-11                  | `422` com o erro genérico e conta permanece não ativada                                                                |
| TU-13 | Segunda ativação usando o mesmo token                                | CA-12                  | `422` com o erro genérico e conta permanece ativada                                                                    |
| TU-14 | Cadastro repetido com um e-mail já registrado                        | CA-13                  | `204` com corpo vazio, total de usuários inalterado e nenhuma mensagem nova na caixa                                   |
| TU-15 | Cadastro repetido com e-mail registrado e conta ainda não ativada    | CA-14                  | `204` com corpo vazio, nenhuma mensagem nova na caixa e nenhuma ativação nova gravada                                  |
| TU-16 | Cadastro repetido com o mesmo e-mail em caixa alta                   | CA-15                  | Tratado como e-mail já cadastrado, `204` e total de usuários inalterado                                                |
| TU-17 | Cadastro com apelido de e-mail derivado de um endereço já registrado | CA-16                  | `204`, novo usuário gravado e mensagem de ativação enviada ao endereço com apelido                                     |
| TU-18 | Cadastro com apelido e capitalização mistas                          | CA-17                  | E-mail gravado em caixa baixa preservando o apelido e mensagem enviada ao endereço normalizado                         |
| TU-19 | Mensagem fora do schema publicada direto na fila de e-mails          | -                      | Consumidor segue vivo, a mensagem termina em `emails.dead` e nada chega à caixa de e-mail                              |
| TU-20 | Cadastro válido feito enquanto o servidor SMTP está indisponível     | -                      | `204` com corpo vazio, usuário gravado e mensagem retida em `emails.retry` em vez de perdida                           |

## Fora de Escopo

- Verificação de senha, sessões e qualquer emissão de credencial, já que não há login nesta entrega;
- Reenvio do e-mail de ativação, rotina de expurgo de tokens expirados e qualquer retentativa automática de envio;
- Outbox transacional: a publicação na fila acontece após o commit e a janela entre os dois é aceita conforme `DEC-20`;
- Extração do consumidor para um processo e uma implantação próprios, junto com escala horizontal do despachante;
- Observabilidade da fila: métricas de profundidade, alarme sobre `emails.dead` e reprocessamento das mensagens mortas;
- Priorização, agendamento e limitação de vazão dos envios;
- Limitação de taxa, proteção contra automação e bloqueio de provedores de e-mail descartável nas duas rotas;
- Observabilidade: logs estruturados, métricas, tracing e correlação de requisições;
- Ajuste fino do pool de conexões, réplicas de leitura e estratégias de failover do PostgreSQL;
- Configuração de entregabilidade do domínio remetente (SPF, DKIM e DMARC), que é feita no provedor e não no código;
- Templates de e-mail com React Email e internacionalização do conteúdo das mensagens e dos erros;
- Empacotamento e implantação em produção, incluindo `Dockerfile` da aplicação e execução automática de migrações no deploy;
- Implementação da página web `/auth/users/activations`, que apenas consome a rota de ativação.
