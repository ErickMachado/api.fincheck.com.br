# TASK-13: Resiliência da entrega de e-mail

A escolha de tirar o envio do caminho da requisição só se paga se o comportamento sob falha estiver comprovado. Esta tarefa cobre os dois cenários de resiliência da TechSpec: uma mensagem fora do schema publicada direto na fila não pode derrubar o consumidor e precisa terminar em `emails.dead`, e um cadastro feito com o servidor SMTP indisponível precisa responder `204`, gravar o usuário e reter a mensagem em `emails.retry` em vez de perdê-la. O segundo cenário vive numa suíte própria, que para o contêiner do MailCatcher logo após a subida e observa a profundidade da fila de espera pelo próprio canal AMQP, sem precisar religar o serviço.

## Subtarefas

- [x] Adicionar ao orquestrador de testes um utilitário que publica uma mensagem arbitrária na exchange de e-mails e um utilitário que consulta a profundidade das filas `emails.outgoing`, `emails.retry` e `emails.dead` pelo canal AMQP;
- [x] Adicionar ao orquestrador um modo de subida que para o contêiner do MailCatcher logo após iniciar o servidor, deixando o SMTP indisponível para a suíte que precisa disso;
- [x] Cobrir TU-19 publicando uma mensagem fora do schema e afirmando que o consumidor segue vivo, que a mensagem termina em `emails.dead` e que nada chega à caixa de e-mail;
- [x] Criar `tests/integration/api/users/email-outage.spec.ts` como suíte isolada e cobrir TU-20, afirmando `204` com corpo vazio, usuário gravado e mensagem retida em `emails.retry`;
- [x] Aguardar as condições por sondagem com prazo máximo, sem espera fixa, mantendo as suítes consistentes entre execuções repetidas;
- [x] Liberar todos os contêineres e conexões abertos pelas suítes, inclusive no caminho em que o MailCatcher foi parado de propósito;
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

- [x] TU-19: Mensagem fora do schema publicada direto na fila de e-mails
- [x] TU-20: Cadastro válido feito enquanto o servidor SMTP está indisponível

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-06.md`
- `.specs/cadastro-de-usuarios/tasks/task-11.md`
- `tests/setup/orchestrator.ts`
