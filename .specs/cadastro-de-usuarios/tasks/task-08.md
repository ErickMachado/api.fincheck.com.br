# TASK-08: Entrega de e-mail transacional

Com o transporte de mensagens pronto e os templates escritos, esta tarefa costura os dois lados da entrega. O caso de uso enxerga apenas a interface `Mailer`, com um método por mensagem transacional; a implementação publica na fila a intenção de envio (`type` mais `payload`), nunca o HTML já renderizado, conforme `DEC-19`. Do outro lado, o despachante escolhe o template pelo tipo da mensagem, renderiza HTML e texto puro e entrega ao servidor SMTP — e não ao SDK do provedor, conforme `DEC-15`, o que mantém o provedor substituível e permite apontar o mesmo código para um servidor local.

## Subtarefas

- [x] Criar `src/application/interfaces/mailer.ts` declarando o tipo `ActivationMail` (`firstName`, `recipient`, `token`) e a interface `Mailer` com o método `sendActivation`;
- [x] Criar `src/infra/queue/messages.ts` com o tipo `EmailMessage` (`type` mais `payload`) e o schema Zod correspondente, usado pelo consumidor para validar a mensagem na entrada;
- [x] Criar `src/infra/email/transport.ts` montando o transporte SMTP com pool a partir da configuração `smtp`, desabilitando a autenticação quando `SMTP_USER` estiver vazio, e expondo o encerramento;
- [x] Criar `src/infra/email/queued-mailer.ts` implementando `Mailer` pela publicação na exchange `fincheck.emails` com a chave `send`, sem tocar no SMTP;
- [x] Criar `src/infra/email/dispatcher.ts` implementando `EmailDispatcher`: escolher o template pelo `type` da mensagem, renderizar HTML e texto puro e entregar ao transporte usando `MAIL_FROM_ADDRESS` e `MAIL_FROM_NAME` como remetente;
- [x] Propagar a falha de entrega para o consumidor em vez de silenciá-la, para que a mensagem siga o caminho de retentativa definido em TASK-06;
- [x] Validar manualmente o caminho completo contra o `compose.yml`, publicando uma mensagem de ativação e conferindo a chegada no MailCatcher com o remetente e o link corretos;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-07

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
- `.specs/cadastro-de-usuarios/tasks/task-06.md`
- `.specs/cadastro-de-usuarios/tasks/task-07.md`
