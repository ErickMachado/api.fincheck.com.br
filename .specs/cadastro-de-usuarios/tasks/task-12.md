# TASK-12: Rota de ativação de conta

Com o cadastro no ar, falta fechar o fluxo: `POST /v1/users/activations` consome o token recebido por e-mail e marca a conta como ativada. O token chega no corpo, e não na query string, para que não seja registrado em logs de acesso nem propagado por `Referer`, conforme `DEC-11`. Token inexistente, expirado ou já consumido produzem exatamente a mesma resposta `422` com mensagem genérica, conforme `DEC-10`, e a leitura da ativação bloqueia a linha até o fim da transação, impedindo que o mesmo token seja consumido duas vezes em paralelo.

## Subtarefas

- [x] Criar `src/application/usecases/auth/activate-user.ts` recebendo por injeção o `Transaction`, o `UserRepository` e o `ActivationRepository`;
- [x] Resolver a ativação por `Activation.hashToken` seguido de `findByTokenHash`, disparando o `Problem` de `422` com mensagem genérica quando a ativação não existir ou quando `isPending` for falso para a data corrente;
- [x] Consumir a ativação e ativar o usuário dentro de um único `run` do `Transaction`, gravando as duas alterações;
- [x] Criar `src/application/controllers/users/activate-user.ts` validando o corpo com Zod para a chave `token` obrigatória com ao menos um caractere e devolvendo `204` sem corpo em caso de sucesso;
- [x] Registrar a rota `POST /v1/users/activations` em `src/main/router.ts` usando o adaptador de controllers e ligar o caso de uso na composição do `app.ts`;
- [x] Criar `tests/integration/api/users/activation.spec.ts` com a suíte descrita como `POST /v1/users/activations`, no formato AAA, usando os utilitários de cadastro e de extração de token do orquestrador;
- [x] Cobrir o vencimento da validade de TU-12 sem depender do horário real, manipulando o estado da ativação pelo utilitário de banco do orquestrador para manter o teste consistente entre execuções;
- [x] Cobrir os casos TU-10 a TU-13 conforme a tabela de testes da TechSpec;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-09
- CA-10
- CA-11
- CA-12

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/testing-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- [x] TU-10: Ativação com token válido e ainda não usado
- [x] TU-11: Ativação com token inexistente
- [x] TU-12: Ativação com token cuja validade já venceu
- [x] TU-13: Segunda ativação usando o mesmo token

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-11.md`
- `src/main/router.ts`
- `src/main/app.ts`
- `tests/setup/orchestrator.ts`
