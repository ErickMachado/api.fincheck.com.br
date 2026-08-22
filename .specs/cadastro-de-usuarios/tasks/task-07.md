# TASK-07: Templates do e-mail de ativação

O e-mail de ativação precisa chegar legível em clientes que ignoram CSS externo, então os templates são escritos em React Email com o componente `Tailwind`, que converte as classes em estilos inline no momento da renderização, conforme `DEC-24`. Esta tarefa entrega a casca comum das mensagens transacionais e o template da ativação, que monta o link no formato `<APP_WEB_URL>/auth/users/activations?token=<token>` exigido por `CA-07`. As duas versões da mensagem, HTML e texto puro, saem da mesma árvore de componentes conforme `DEC-25`.

## Subtarefas

- [x] Criar `src/infra/email/templates/layout.tsx` com o provedor do `Tailwind`, cabeçalho, rodapé e o aviso de que a caixa remetente não é monitorada;
- [x] Criar `src/infra/email/templates/activation.tsx` recebendo o primeiro nome e o token, montando o link `<APP_WEB_URL>/auth/users/activations?token=<token>` a partir da configuração da aplicação web;
- [x] Informar no corpo da mensagem que o link vale por 15 minutos e serve uma única vez, extraindo o prazo para uma constante nomeada em vez de repetir o valor no texto;
- [x] Garantir que os templates renderizem tanto em HTML quanto em texto puro a partir da mesma árvore de componentes, sem arquivo de texto paralelo;
- [x] Manter cada arquivo abaixo de 100 linhas, quebrando em componentes menores se necessário;
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
