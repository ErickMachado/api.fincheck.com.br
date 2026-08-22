# TASK-05: Hash de senha com argon2id

A senha informada no cadastro nunca é armazenada em claro: a coluna `password_hash` guarda apenas o hash argon2id com seus parâmetros e sal. Esta tarefa entrega o contrato que o caso de uso enxerga e a implementação em `infra` sobre o `@node-rs/argon2`, escolhido em `DEC-03` por distribuir binários pré-compilados e, portanto, funcionar com o `ignore-scripts = true` do `.npmrc`.

## Subtarefas

- [x] Criar `src/application/interfaces/password-hasher.ts` declarando a interface `PasswordHasher` com o método `hash(password: string): Promise<string>`;
- [x] Criar `src/infra/security/password-hasher.ts` implementando `PasswordHasher` com o algoritmo argon2id do `@node-rs/argon2`;
- [x] Extrair para constantes nomeadas quaisquer parâmetros de custo usados na configuração do algoritmo;
- [x] Confirmar que a instalação da biblioteca funciona com `ignore-scripts = true` e que a geração de hash roda sem etapa de compilação;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- `-`

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
- `.specs/cadastro-de-usuarios/tasks/task-01.md`
- `.npmrc`
