# TASK-04: Persistência PostgreSQL, migrações e transações

Esta é a primeira funcionalidade do Fincheck que grava dados, então a tarefa entrega toda a fundação de persistência: pool de conexões, versionamento de esquema por migrações `.sql`, a transação explícita resolvida por `AsyncLocalStorage` conforme `DEC-26` e os dois repositórios. A inserção do usuário usa `INSERT ... ON CONFLICT (email) DO NOTHING RETURNING id` para tratar e-mail já cadastrado sem exceção e sem corrida, sustentando a resposta indistinguível exigida pelo PRD, e a leitura da ativação bloqueia a linha até o fim da transação para impedir consumo simultâneo do mesmo token.

## Subtarefas

- [x] Criar `src/application/interfaces/transaction.ts` declarando a interface `Transaction` com o método `run<T>(handler: () => Promise<T>): Promise<T>`;
- [x] Criar `src/infra/database/postgres/connection.ts`, montando o pool a partir da configuração e expondo o encerramento;
- [x] Criar `src/infra/database/postgres/context.ts`, guardando o cliente da transação corrente num `AsyncLocalStorage` e resolvendo para o pool quando não houver transação aberta;
- [x] Criar `src/infra/database/postgres/transaction.ts` implementando `Transaction` com `BEGIN`, `COMMIT` e `ROLLBACK`, publicando o cliente no contexto, liberando-o ao final e fazendo uma chamada aninhada de `run` entrar na transação corrente em vez de abrir uma nova;
- [x] Criar `src/infra/database/migrator.ts` executando as migrações pela API programática do `node-pg-migrate`, de forma reutilizável pelo script de CLI e pelo orquestrador de testes;
- [x] Criar a migração `create_users` (`up` e `down`) com as colunas `id`, `email`, `first_name`, `is_activated`, `last_name`, `password_hash`, `created_at` e `updated_at`, o índice único `users_email_key` e a restrição `users_email_lowercase` exigindo `email = lower(email)`, deixando o prefixo de timestamp ser gerado pela ferramenta;
- [x] Criar a migração `create_user_activation_tokens` (`up` e `down`) com as colunas `id`, `user_fk`, `consumed_at`, `expires_at`, `token_hash` e `created_at`, o índice único de `token_hash`, a chave estrangeira para `users(id)` com `ON DELETE CASCADE` e o índice B-tree sobre `user_fk`;
- [x] Criar `src/infra/database/postgres/repositories/user.ts` implementando `UserRepository`, com `create` usando `INSERT ... ON CONFLICT (email) DO NOTHING RETURNING id` e devolvendo `false` quando não houver retorno, além de `findById` e `update`;
- [x] Criar `src/infra/database/postgres/repositories/activation.ts` implementando `ActivationRepository`, com `findByTokenHash` bloqueando a linha encontrada até o fim da transação;
- [x] Fazer os repositórios resolverem o executor pelo contexto, de modo que participem da transação corrente quando houver uma e usem o pool quando não houver;
- [x] Validar `npm run db:migrate` contra o PostgreSQL do `compose.yml` e conferir que a reversão das duas migrações também funciona;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-02
- CA-13
- CA-14
- CA-15
- CA-16
- CA-17

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/database-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-01.md`
- `.specs/cadastro-de-usuarios/tasks/task-03.md`
- `src/infra/docker/compose.yml`
