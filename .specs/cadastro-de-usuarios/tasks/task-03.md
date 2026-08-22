# TASK-03: Camada de domínio do cadastro

O cadastro depende de três invariantes que precisam viver no domínio: o e-mail é normalizado antes de ser gravado e comparado, o usuário nasce não ativado e transita uma única vez para ativado, e o token de ativação é aleatório, tem validade de 15 minutos e só pode ser consumido uma vez. Esta tarefa entrega o objeto de valor `Email`, as entidades `User` e `Activation` — responsáveis por gerar seus próprios ULIDs e metadados — e as interfaces de acesso a dados que a camada `infra` vai implementar.

## Subtarefas

- [x] Criar `src/domain/value-objects/email.ts` com `Email.create`, aparando espaços, convertendo para caixa baixa, validando o formato e o limite de 254 caracteres, e expondo `value` e `toString`;
- [x] Declarar o tipo de metadados (`createdAt` e `updatedAt`) usado pelos métodos `restore`, mantendo as datas em UTC;
- [x] Criar `src/domain/entities/user.ts` com as propriedades na ordem `id`, `email`, `firstName`, `isActivated`, `lastName`, `passwordHash`, `createdAt`, `updatedAt`, marcando como `readonly` tudo que nunca sofre atualização;
- [x] Implementar `User.create`, gerando o ULID, iniciando `isActivated` em falso e gerando `createdAt` e `updatedAt` na própria entidade;
- [x] Implementar `User.restore` e `User.activate`, com `activate` marcando `isActivated` como verdadeiro e atualizando `updatedAt`;
- [x] Criar `src/domain/entities/activation.ts` com as propriedades na ordem `id`, `userId`, `consumedAt`, `expiresAt`, `tokenHash`, `createdAt`;
- [x] Implementar `Activation.issue`, gerando 32 bytes aleatórios com `crypto.randomBytes` codificados em `base64url`, devolvendo `IssuedActivation` com o token em claro apenas em memória e persistindo somente o resumo, conforme `DEC-04`;
- [x] Implementar `Activation.hashToken` com SHA-256 em hexadecimal e extrair a validade de 15 minutos para uma constante nomeada;
- [x] Implementar `Activation.isPending`, recebendo a data de referência e devolvendo verdadeiro apenas quando o token não foi consumido e ainda não expirou, e `Activation.consume`, que preenche `consumedAt`;
- [x] Implementar `Activation.restore`;
- [x] Criar `src/domain/repositories/user.ts` declarando `UserRepository` com `create`, `findById` e `update`, documentando que `create` resolve para `false` quando o e-mail já pertence a outro usuário;
- [x] Criar `src/domain/repositories/activation.ts` declarando `ActivationRepository` com `create`, `findByTokenHash` e `update`;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-02
- CA-08
- CA-11
- CA-12
- CA-15
- CA-17

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
