# TASK-10: Composição da aplicação e declaração das rotas

Todas as peças existem, mas nada ainda as conecta: o `app.ts` sobe um Fastify sem rotas e sem banco. Esta tarefa conecta a aplicação ao PostgreSQL, instancia repositório, gateways, casos de uso e controllers, declara as duas rotas versionadas pelo adaptador do Fastify e encerra o pool de conexões junto do servidor. Ao final, as duas rotas respondem de ponta a ponta contra o compose local.

## Subtarefas

- [ ] Criar `src/main/router.ts` declarando `POST /v1/auth/users` e `POST /v1/auth/users/activations`, ligando cada rota ao seu controller pelo adaptador de `src/main/adapters/controller.ts`
- [ ] Alterar `src/main/app.ts` para conectar a `Database` com o grupo `POSTGRES_` da `Configuration` antes de registrar as rotas
- [ ] Instanciar no `app.ts` o `UserRepository`, o `Argon2Hasher` e o `SMTPMailer` com os valores da `Configuration`, e a partir deles os casos de uso e os controllers
- [ ] Registrar o roteador na instância do Fastify, mantendo o `setErrorHandler` do `problem` já existente
- [ ] Fazer `stop()` encerrar o Fastify e desconectar o pool da `Database`
- [ ] Expor o endereço efetivo em que o servidor está escutando, para que o orquestrador de testes consiga montar as requisições quando a porta for `0`
- [ ] Subir o compose local, executar as migrações e exercitar manualmente as duas rotas: um cadastro válido seguido da ativação com o token gravado
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-13
- CA-17
- CA-32
- CA-33

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/main/app.ts`
- `src/main/router.ts`
- `src/main/adapters/controller.ts`
- `src/main/main.ts`
- `src/infra/docker/compose.yml`
