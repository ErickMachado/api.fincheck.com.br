# TASK-5: Repositório de usuários em SQL

O `UserRepository` é o único ponto que sabe como a conta e o token chegam ao PostgreSQL. Esta tarefa implementa as três operações do contrato em SQL escrito à mão, dentro de transações explícitas abertas pelo `Database.transaction`: a criação da conta com `ON CONFLICT (email) DO NOTHING`, que elimina a corrida entre dois cadastros simultâneos sem consulta prévia de existência, a busca do token pelo valor exato e o consumo do token guardado por `used_at IS NULL`, que garante o uso único mesmo sob concorrência.

## Subtarefas

- [x] Criar `src/infra/database/repositories/user.ts` implementando `UserRepository` e recebendo a `Database` pelo construtor
- [x] Implementar `create` em transação: inserir em `users` com `ON CONFLICT (email) DO NOTHING RETURNING id` e, quando o `INSERT` não devolver linha, encerrar sem escrever e devolver `false`
- [x] Completar `create` inserindo a linha em `user_activation_tokens` quando a conta foi criada, reaproveitando o `created_at` da conta, e devolver `true`
- [x] Implementar `findActivationToken(value)` consultando `user_activation_tokens` pelo valor exato do token e devolvendo `UserActivationToken.restore(...)` ou `null`
- [x] Implementar `activateUser(token)` em transação: atualizar `used_at` com a guarda `used_at IS NULL` e `RETURNING user_id_fk`, devolvendo `false` quando nenhuma linha voltar
- [x] Completar `activateUser` atualizando `verified_at` e `updated_at` da conta devolvida pela primeira atualização e devolvendo `true`
- [x] Traduzir erros do PostgreSQL para `Problem` com `try-catch`, permitido apenas nesta camada
- [x] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-17
- CA-19
- CA-21
- CA-22
- CA-23
- CA-26
- CA-27

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/code-standards.md`
- `.claude/rules/database-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/infra/database/repositories/user.ts`
- `src/infra/database/connection.ts`
- `src/domain/repositories/user.ts`
