# Code Standards

## Segurança

- SEMPRE armazene valores sensíveis em variáveis de ambiente;

## Qualidade

- Nomes de variáveis, funções e classes devem estar em inglês;
- NÃO adicione comentários explicando o que o código faz. O código de ser claro e autoexplicativo;
- Listagens devem ser paginadas;
- SEMPRE importe arquivos usando os apelidos do TypeScript:

❌ Não faça:

```typescript
import { type UserRepository } from '../../../domain/repositories/user'
```

✅ Faça:

```typescript
import { type UserRepository } from '@domain/repositories/user'
```

- Mantenha classes e arquivos abaixo de 100 linhas;
- Limite métodos e funções a 30 linhas;
- Valores mágicos devem ser extraídos em constantes:

❌ Não faça:

```typescript
if (age < 18) {
}
```

✅ Faça:

```typescript
const MIN_AGE = 18

if (age < MIN_AGE) {
}
```

- Limite os parâmetros de funções a 3. Se mais parâmetros forem necessários, receba um objeto;
- Não crie abstrações para bibliotecas de ID ou data;
- Siglas devem estar em caixa alta:

❌ Não faça:

```typescript
type HttpRequest = {}
```

✅ Faça:

```typescript
type HTTPRequest = {}
```

## Identificadores

- Identificadores da entidade na classe de domínio;
- SEMPRE use ULID para gerar IDs;

## Datas

- Metadados de sistema devem estar em UTC no formato RFC 8601;
- Metadados devem ser gerados na classe de domínio;
- Para informações dependentes da timezone do usuário (como transações), a timezone deve ser salva em um campo separado;

## Erros

- NÃO crie erros customizados, sempre use o `Problem` para disparar erros conhecidos;
- O uso de `try-catch` só é permitido em classes da camada `infra` para tradução de erros externos para HTTP (ex: Erro `23505` do PostgreSQL para `Problem`);

## Variáveis de Ambiente

- Sempre priorize configurações granulares:

❌ Não faça:

```
DATABASE_URL="postgres://local_user:local_password@localhost:5432/local_db?sslmode=disable"
```

✅ Faça:

```
POSTGRES_USER="local_user"
POSTGRES_PASSWORD="local_password"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DATABASE="local_db"
POSTGRES_SSL="false"
```

- Agrupe variáveis por contexto e pule uma linha entre cada grupo:

❌ Não faça:

```
APP_ENV="development"
APP_HOST="127.0.0.1"
APP_PORT="4000"
POSTGRES_USER="local_user"
POSTGRES_PASSWORD="local_password"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DATABASE="local_db"
POSTGRES_SSL="false"
```

✅ Faça:

```
APP_ENV="development"
APP_HOST="127.0.0.1"
APP_PORT="4000"

POSTGRES_USER="local_user"
POSTGRES_PASSWORD="local_password"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DATABASE="local_db"
POSTGRES_SSL="false"
```

## Classes de domínio

- Organize as propriedades da classe na order `ID da entidades -&gt; ID de outras entidades -&gt; propriedades em ordem alfabética -&gt; metadados`:

❌ Não faça:

```typescript
class {
  public readonly createdAt: Date
  public readonly id: string
  public slug: string
  public title: string
  public updatedAt: Date
}
```

✅ Faça:

```typescript
class {
  public readonly id: string
  public slug: string
  public title: string
  public readonly createdAt: Date
  public updatedAt: Date
}
```

- Propriedades que nunca sofrem atualizações devem ser marcadas como `readonly`;
