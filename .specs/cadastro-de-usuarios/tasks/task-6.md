# TASK-6: Derivação de hash de senha com Argon2id

A senha nunca é armazenada em texto puro e o caso de uso não pode conhecer o algoritmo escolhido. Esta tarefa declara a interface `Hasher` na camada `application` e a implementa na camada `infra` com Argon2id pelo `@node-rs/argon2`, que distribui binários pré-compilados e portanto instala sob o `ignore-scripts = true` do `.npmrc`, usando os parâmetros de custo do produto: 19 MiB de memória, 2 iterações e paralelismo 1.

## Subtarefas

- [ ] Criar `src/application/interfaces/hasher.ts` declarando a interface `Hasher` com o método `hash(plain: string): Promise<string>`
- [ ] Criar `src/infra/security/argon2-hasher.ts` implementando `Hasher` com o `@node-rs/argon2` e o algoritmo Argon2id
- [ ] Extrair os parâmetros de custo (19 MiB de memória, 2 iterações e paralelismo 1) em constantes nomeadas, sem valores mágicos no corpo do método
- [ ] Conferir que o hash gerado embute os parâmetros de custo e preserva a senha exatamente como recebida, incluindo espaços nas bordas
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-6
- CA-12

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pela suíte de TASK-12.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/application/interfaces/hasher.ts`
- `src/infra/security/argon2-hasher.ts`
- `.npmrc`
