# TASK-10: Orquestrador de testes de integração

A cobertura do projeto é feita majoritariamente por testes blackbox a partir da rota HTTP, com banco, broker e servidor SMTP reais em contêiner, conforme `DEC-17`. Nenhum arquivo `.spec.ts` pode conter ciclo de vida de serviço, então esta tarefa entrega o orquestrador que sobe PostgreSQL, RabbitMQ e MailCatcher efêmeros por suíte, roda as migrações, inicia e para o servidor, limpa os três entre casos e expõe os utilitários de asserção. Como a entrega de e-mail é assíncrona, o orquestrador também expõe uma espera por sondagem com prazo máximo, em vez de espera fixa.

## Subtarefas

- [x] Criar `tests/setup/orchestrator.ts` subindo PostgreSQL e RabbitMQ com os pacotes dedicados do Testcontainers e o MailCatcher com `GenericContainer` sobre a imagem `sj26/mailcatcher`;
- [x] Apontar as variáveis de ambiente de PostgreSQL, RabbitMQ e SMTP para os hosts e portas mapeados dos contêineres antes de instanciar a `Configuration`, usando a porta `1025` do MailCatcher para SMTP;
- [x] Executar as migrações pelo `migrator` da camada `infra` após a subida do banco;
- [x] Expor `start` e `stop`, iniciando e parando o servidor pelo `FincheckAPI` e derrubando os contêineres ao final, e expor o endereço do servidor para as requisições dos testes;
- [x] Expor uma limpeza para o `beforeEach` que esvazia as tabelas, drena as filas `emails.outgoing`, `emails.retry` e `emails.dead` e limpa a caixa do MailCatcher;
- [x] Criar `tests/setup/mailcatcher.ts` como cliente da API HTTP do MailCatcher na porta web mapeada (`1080`), com listagem de mensagens (`GET /messages`), leitura de corpo (`GET /messages/:id.html`) e limpeza da caixa (`DELETE /messages`);
- [x] Expor um utilitário que aguarda por sondagem a chegada de uma quantidade esperada de mensagens na caixa, com prazo máximo, falhando por tempo esgotado quando a condição não acontecer;
- [x] Expor um utilitário que drena a fila de e-mails e permite afirmar a ausência de mensagens novas na caixa, usado pelos casos de e-mail já cadastrado;
- [x] Expor um utilitário de consulta ao banco para as asserções de estado dos testes, evitando que as suítes abram conexão própria;
- [x] Garantir que todos os contêineres e conexões sejam liberados no `stop`, sem deixar porta ou processo pendurado;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- `-`

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/testing-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-04.md`
- `.specs/cadastro-de-usuarios/tasks/task-09.md`
- `.env.test`
- `vitest.config.ts`
