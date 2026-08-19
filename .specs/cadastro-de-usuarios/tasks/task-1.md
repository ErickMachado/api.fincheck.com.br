# TASK-1: Fundação do projeto: dependências, apelidos de módulo e configuração de ambiente

O repositório hoje declara apenas Fastify e Zod e a `Configuration` valida somente o grupo `APP_`. Nenhuma das camadas previstas no padrão de pastas tem apelido de importação e o Vitest não mede cobertura. Esta tarefa instala as dependências nas versões fixadas pela TechSpec, declara os apelidos `@application/*`, `@domain/*`, `@infra/*` e `@tests/*`, amplia a `Configuration` com os grupos `POSTGRES_` e `SMTP_` e com `APP_WEB_URL`, configura o limiar de cobertura de 90% e entrega o compose local com PostgreSQL e MailCatcher. É a tarefa que desbloqueia todas as demais.

## Subtarefas

- [ ] Instalar as dependências de produção nas versões exatas da TechSpec: `pg@8.23.0`, `node-pg-migrate@9.0.0`, `ulidx@2.4.1`, `@node-rs/argon2@2.0.2`, `nodemailer@8.0.11`, `@react-email/components@1.0.12`, `react@19.2.8` e `react-dom@19.2.8`
- [ ] Instalar as dependências de desenvolvimento nas versões exatas da TechSpec: `@types/nodemailer@8.0.1`, `@types/react@19.2.18`, `testcontainers@12.1.0`, `@testcontainers/postgresql@12.1.0`, `@faker-js/faker@10.5.0` e `@vitest/coverage-v8@4.1.10`
- [ ] Adicionar ao `package.json` os scripts `migration:create`, `migration:up` e `migration:down` com os comandos declarados na TechSpec, apontando para `src/infra/database/migrations`
- [ ] Declarar em `tsconfig.json` os apelidos `@application/*`, `@domain/*`, `@infra/*` e `@tests/*`, incluir `DOM` em `lib` e definir `jsx` como `react-jsx`
- [ ] Configurar em `vitest.config.ts` o provedor de cobertura `v8`, o limiar de 90% (linhas, funções, ramos e instruções) restrito a `src` e um `hookTimeout` folgado o bastante para a subida dos contêineres no `beforeAll`
- [ ] Declarar `APP_WEB_URL` e os grupos `POSTGRES_` e `SMTP_` em `.env.example`, agrupados por contexto e separados por uma linha em branco entre grupos
- [ ] Declarar as mesmas variáveis em `.env.test`, com valores de espaço reservado nos grupos `POSTGRES_` e `SMTP_`, que o orquestrador sobrescreve com host e porta dinâmicos
- [ ] Estender `CONFIG_SCHEMA` e a classe `Configuration` em `src/common/core/config.ts` com `APP_WEB_URL` no getter `app` e com os novos getters `postgres` e `smtp`, coagindo `POSTGRES_PORT` e `SMTP_PORT` para número e `POSTGRES_SSL` e `SMTP_SECURE` para booleano
- [ ] Criar `src/infra/docker/compose.yml` com um serviço PostgreSQL e um serviço MailCatcher (`sj26/mailcatcher:v0.10.0`, SMTP em `1025` e API HTTP em `1080`) para uso em desenvolvimento
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

Não se aplica: a tarefa entrega a fundação técnica que sustenta os demais critérios e não atende nenhum diretamente.

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `.env.example`
- `.env.test`
- `.npmrc`
- `src/common/core/config.ts`
- `src/infra/docker/compose.yml`
