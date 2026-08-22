# TASK-09: Composição da aplicação

Todas as peças de infraestrutura existem, mas nada as instancia: hoje `src/main/app.ts` apenas cria o Fastify e registra o tratador de erros. Esta tarefa transforma o `app.ts` no ponto de composição descrito em `folder-standards.md`, montando pool do PostgreSQL, conexão com o RabbitMQ, topologia, transporte SMTP, repositórios e gateways, e subindo o consumidor de e-mail no mesmo processo da API, conforme `DEC-22`. Também entrega o encerramento ordenado de todos esses recursos e a exposição do endereço em que o servidor subiu, do qual o orquestrador de testes depende.

## Subtarefas

- [x] Estender `FincheckAPI.create` para instanciar o pool do PostgreSQL, a conexão com o RabbitMQ, o transporte SMTP, os repositórios, o `Transaction`, o `PasswordHasher`, o `QueuedMailer` e o `EmailDispatcher` a partir da `Configuration`;
- [x] Declarar a topologia da fila na subida da aplicação, antes de começar a publicar ou consumir;
- [x] Subir o consumidor de `emails.outgoing` apontando para o despachante de e-mail;
- [x] Expor o endereço em que o servidor está escutando, para que os testes possam montar as requisições sem conhecer a porta escolhida;
- [x] Estender `FincheckAPI.stop` para encerrar, em ordem, o servidor HTTP, o consumidor, a conexão com o broker, o transporte SMTP e o pool do PostgreSQL, sem deixar recurso ou porta pendurada;
- [x] Ajustar `src/main/main.ts` caso o parse de variáveis ou a inicialização precisem acompanhar as mudanças;
- [x] Criar `src/main/router.ts` com o registro de rotas ainda vazio, pronto para receber as rotas em TASK-11 e TASK-12, e ligá-lo ao `app.ts`;
- [x] Manter `app.ts` abaixo de 100 linhas, extraindo fábricas auxiliares se necessário;
- [x] Validar a subida e o desligamento completos contra o `compose.yml`;
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
- `.specs/cadastro-de-usuarios/tasks/task-02.md`
- `.specs/cadastro-de-usuarios/tasks/task-04.md`
- `.specs/cadastro-de-usuarios/tasks/task-05.md`
- `.specs/cadastro-de-usuarios/tasks/task-08.md`
- `src/main/app.ts`
- `src/main/main.ts`
