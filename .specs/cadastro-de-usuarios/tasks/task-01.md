# TASK-01: Fundação de configuração, dependências e ambiente

O repositório hoje só possui o servidor Fastify, o `Problem` e a configuração das variáveis `APP_*`. Esta tarefa instala todas as dependências previstas na TechSpec, cria os apelidos de importação das camadas novas, estende a `Configuration` com os grupos `postgres`, `rabbitmq`, `smtp` e `mail` e com a URL da aplicação web, documenta as variáveis nos arquivos de ambiente e entrega o `compose.yml` de desenvolvimento com PostgreSQL, RabbitMQ e MailCatcher. É a base sobre a qual todas as demais tarefas são construídas e, por isso, é a única tarefa da primeira onda.

## Subtarefas

- [x] Adicionar as dependências de produção nas versões exatas da TechSpec: `pg@8.23.0`, `node-pg-migrate@9.0.0`, `@node-rs/argon2@2.1.0`, `nodemailer@8.0.11`, `amqplib@2.0.1`, `@react-email/components@1.0.12`, `react@19.2.8`, `react-dom@19.2.8` e `ulid@3.0.2`;
- [x] Adicionar as dependências de desenvolvimento nas versões exatas da TechSpec: `@types/pg@8.21.0`, `testcontainers@12.1.0`, `@testcontainers/postgresql@12.1.0`, `@testcontainers/rabbitmq@12.1.0`, `@faker-js/faker@10.6.0`, `@types/nodemailer@8.0.1`, `@types/react@19.2.18`, `@types/react-dom@19.2.4` e `@vitest/coverage-v8@4.1.10`;
- [x] Confirmar que nenhuma versão instalada fere o período de quarentena de `min-release-age` do `.npmrc` e, se ferir, selecionar a versão anterior;
- [x] Adicionar os apelidos `@application/*`, `@domain/*`, `@infra/*` e `@tests/*` em `compilerOptions.paths` do `tsconfig.json`;
- [x] Habilitar `"jsx": "react-jsx"` no `tsconfig.json` para permitir os templates de e-mail em `.tsx`;
- [x] Adicionar os scripts `db:migrate` e `db:migrate:create` no `package.json`;
- [x] Estender `src/common/core/config.ts` validando e expondo os grupos `postgres` (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DATABASE`, `POSTGRES_SSL`), `rabbitmq` (`RABBITMQ_HOST`, `RABBITMQ_PORT`, `RABBITMQ_USER`, `RABBITMQ_PASSWORD`, `RABBITMQ_VHOST`), `smtp` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`), `mail` (`MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`) e a URL da aplicação web (`APP_WEB_URL`);
- [x] Documentar todas as variáveis novas em `.env.example`, agrupadas por contexto e separadas por uma linha em branco entre cada grupo;
- [x] Definir os valores das variáveis novas em `.env.test`, lembrando que host e porta de PostgreSQL, RabbitMQ e SMTP são sobrescritos em tempo de execução pelo orquestrador de testes;
- [x] Criar `src/infra/docker/compose.yml` subindo PostgreSQL, RabbitMQ e MailCatcher para desenvolvimento local, lendo as credenciais das variáveis de ambiente;
- [x] Ampliar `hookTimeout` e `testTimeout` em `vitest.config.ts` para acomodar a subida dos contêineres, sem habilitar ainda o limite mínimo de cobertura, que é entregue em TASK-14;
- [x] Validar que o `compose.yml` sobe os três serviços, que `npm run start:dev` inicia com as variáveis novas e que `npm run test`, `npm run lint:check` e `npm run format:check` continuam passando.

## Critérios de Aceitação

- CA-07

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `src/common/core/config.ts`
- `tsconfig.json`
- `vitest.config.ts`
- `package.json`
- `.npmrc`
- `.env.example`
- `.env.test`
