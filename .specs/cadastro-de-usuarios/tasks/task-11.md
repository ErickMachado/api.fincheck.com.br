# TASK-11: Infraestrutura de testes: orquestrador, caixa de entrada e geradores de dados

Os testes da funcionalidade são de integração blackbox contra as rotas HTTP, com PostgreSQL e SMTP reais em contêineres efêmeros. Esta tarefa entrega o orquestrador que concentra contêineres, migrações, servidor e limpeza de estado — nada disso pode viver dentro dos arquivos `.spec.ts` —, a classe utilitária que lê as mensagens pela API HTTP do MailCatcher e os construtores de dados aleatórios com `@faker-js/faker`.

## Subtarefas

- [ ] Criar `tests/mocks/users.ts` com construtores de corpos de cadastro aleatórios usando `@faker-js/faker`, permitindo sobrescrever campos individualmente
- [ ] Criar `tests/setup/mailbox.ts` sobre a API HTTP do MailCatcher, expondo a listagem de mensagens (`GET /messages`), a leitura da parte HTML (`GET /messages/:id.html`), a leitura do texto puro (`GET /messages/:id.plain`) e a limpeza da caixa (`DELETE /messages`)
- [ ] Criar `tests/setup/orchestrator.ts` com `start()`, que sobe o PostgreSQL com `@testcontainers/postgresql` e o MailCatcher com o `GenericContainer` da imagem `sj26/mailcatcher:v0.10.0`, expondo SMTP em `1025` e a API HTTP em `1080`
- [ ] Sobrescrever no `start()` as variáveis dos grupos `POSTGRES_` e `SMTP_` com o host e as portas dinâmicas dos contêineres antes de instanciar a `Configuration`
- [ ] Aplicar as migrações pela API programática do `node-pg-migrate` e iniciar a API, expondo o endereço efetivo do servidor
- [ ] Implementar `stop()` derrubando a API e os dois contêineres e `reset()` truncando `users` e `user_activation_tokens` e esvaziando a caixa do MailCatcher
- [ ] Expor no orquestrador os utilitários exigidos pelas suítes: cadastro de uma conta, consulta da conta pelo e-mail, consulta do token pela conta, contagem de linhas das duas tabelas e envelhecimento do `expires_at` de um token
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

Não se aplica: a tarefa entrega a infraestrutura que executa TU-1 a TU-36, sem atender nenhum critério diretamente.

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/testing-standards.md`

## Testes

Não se aplica: a tarefa é pré-requisito de TU-1 a TU-36, distribuídos entre TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `tests/setup/orchestrator.ts`
- `tests/setup/mailbox.ts`
- `tests/mocks/users.ts`
- `.env.test`
- `vitest.config.ts`
