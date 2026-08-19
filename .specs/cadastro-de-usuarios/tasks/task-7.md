# TASK-7: Template do e-mail de ativação e gateway SMTP

O link de ativação chega ao visitante por uma mensagem transacional entregue pelo relay SMTP, sem que a aplicação conheça o provedor. Esta tarefa declara a interface `Mailer` na camada `application`, entrega o template do e-mail de ativação como componente react-email estilizado pelo componente `Tailwind` — o único formato que produz estilos embutidos aceitos pelos clientes de e-mail — e implementa o `SMTPMailer` sobre o `nodemailer`, que renderiza a mesma peça em HTML e em texto puro e entrega a mensagem a um único destinatário.

## Subtarefas

- [ ] Criar `src/application/interfaces/mailer.ts` com o tipo `AccountActivationInput` (`activationURL`, `firstName` e `to`) e a interface `Mailer` com `sendAccountActivation`
- [ ] Criar `src/infra/mail/templates/tailwind.ts` exportando a configuração de tema compartilhada pelos templates, com as cores, fontes e espaçamentos da marca
- [ ] Criar `src/infra/mail/templates/account-activation.tsx` com o componente `AccountActivationEmail`, envolvido por `<Tailwind config={TAILWIND_CONFIG}>`, que saúda pelo `firstName`, expõe o link de ativação a partir de `activationURL` e informa a validade de 15 minutos
- [ ] Criar `src/infra/mail/smtp-mailer.ts` com o tipo `SMTPConfig` e a classe `SMTPMailer`, que implementa `Mailer` e monta o transporte do `nodemailer` a partir de host, porta, credenciais, `secure` e remetente recebidos separadamente
- [ ] Renderizar a mensagem com `render` para a parte HTML e com `render(..., { plainText: true })` para a alternativa em texto puro, a partir do mesmo componente
- [ ] Enviar a mensagem com o remetente de `SMTP_FROM_ADDRESS` e um único destinatário, aguardando a entrega ao relay e traduzindo a falha para `Problem` com `try-catch`, permitido apenas nesta camada
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-13
- CA-14

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
- `src/application/interfaces/mailer.ts`
- `src/infra/mail/smtp-mailer.ts`
- `src/infra/mail/templates/account-activation.tsx`
- `src/infra/mail/templates/tailwind.ts`
