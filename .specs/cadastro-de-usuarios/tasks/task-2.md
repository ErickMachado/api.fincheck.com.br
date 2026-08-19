# TASK-2: Conexão com o PostgreSQL e migrações do esquema

O produto ainda não tem persistência nem versionamento de esquema. Esta tarefa entrega a classe `Database`, que encapsula o pool do `pg` e concentra `BEGIN`, `COMMIT` e `ROLLBACK` em um único ponto da camada `infra`, e as duas migrações `.sql` que criam `users` e `user_activation_tokens` com suas restrições de unicidade, índices e chave estrangeira. É a base sobre a qual o repositório de usuários e o orquestrador de testes são construídos.

## Subtarefas

- [ ] Criar `src/infra/database/connection.ts` com o tipo `PostgresConfig` e a classe `Database`, expondo `connect`, `query`, `transaction` e `disconnect` sobre o `Pool` do `pg`
- [ ] Implementar `transaction` retirando um cliente do pool, emitindo `BEGIN`, executando o handler, emitindo `COMMIT` quando ele resolve e `ROLLBACK` quando ele lança, e sempre devolvendo o cliente ao pool — único `try-catch` da tarefa, permitido por ser camada `infra`
- [ ] Gerar a migração da tabela `users` com `npm run migration:create`, deixando o prefixo de timestamp para a ferramenta
- [ ] Escrever o `up` e o `down` da migração de `users` com as colunas `id`, `first_name`, `last_name`, `email`, `password_hash`, `verified_at`, `created_at` e `updated_at`, a chave primária `users_pkey` e a restrição `users_email_unique`
- [ ] Gerar a migração da tabela `user_activation_tokens` com `npm run migration:create`
- [ ] Escrever o `up` e o `down` dessa migração com as colunas `id`, `user_id_fk`, `token`, `expires_at`, `used_at` e `created_at`, a chave primária `user_activation_tokens_pkey`, a restrição `user_activation_tokens_token_unique`, o índice `user_activation_tokens_user_id_fk_idx` e a chave estrangeira `user_activation_tokens_user_id_fk_fkey` para `users(id)` com `ON DELETE CASCADE`
- [ ] Subir o compose local, aplicar as migrações com `npm run migration:up` e conferir tabelas, colunas e índices criados; validar o `down` revertendo e reaplicando
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-15
- CA-16
- CA-21
- CA-22
- CA-26

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/database-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/infra/database/connection.ts`
- `src/infra/database/migrations/<timestamp>_create-users.sql`
- `src/infra/database/migrations/<timestamp>_create-user-activation-tokens.sql`
- `src/infra/docker/compose.yml`
