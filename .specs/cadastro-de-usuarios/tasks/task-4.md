# TASK-4: Domínio: `Email`, `User`, `UserActivationToken` e o contrato `UserRepository`

A normalização do endereço de e-mail, a geração do identificador e dos metadados da conta e as regras de validade e uso único do token são regras de negócio e vivem na camada `domain`, não na borda HTTP nem no repositório. Esta tarefa entrega o objeto de valor `Email`, as entidades `User` e `UserActivationToken` e a interface `UserRepository`, que descreve como os casos de uso acessam os dados sem conhecer o PostgreSQL.

## Subtarefas

- [x] Criar `src/domain/value-objects/email.ts` com a classe `Email` e a fábrica `Email.create`, que converte todo o endereço para minúsculas e, quando o nome do usuário contém `+` em posição diferente da primeira, descarta tudo do `+` até o `@`, preservando pontos
- [x] Criar `src/domain/entities/user.ts` com a entidade `User` e a fábrica `User.create`, que gera o `id` em ULID com `ulidx`, define `createdAt` e `updatedAt` em UTC e nasce com `verifiedAt` nulo
- [x] Ordenar as propriedades de `User` conforme o padrão de código (identificador, propriedades em ordem alfabética, metadados) e marcar como `readonly` as que nunca são atualizadas
- [x] Criar `src/domain/entities/user-activation-token.ts` com `UserActivationToken.create(userId)`, que gera o `id` em ULID, o valor com 16 bytes de `crypto.randomBytes` serializados em hexadecimal minúsculo e o `expiresAt` 15 minutos após a criação, com a validade extraída em constante
- [x] Implementar `UserActivationToken.restore(properties)` para reconstruir a entidade a partir da linha do banco e `isUsable()`, que devolve verdadeiro apenas quando `usedAt` é nulo e `expiresAt` ainda não passou
- [x] Criar `src/domain/repositories/user.ts` com o tipo `CreateUserInput` e a interface `UserRepository`, declarando `create`, `findActivationToken` e `activateUser` com as assinaturas da TechSpec
- [x] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-15
- CA-16
- CA-20
- CA-21
- CA-24
- CA-25
- CA-27

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/domain/value-objects/email.ts`
- `src/domain/entities/user.ts`
- `src/domain/entities/user-activation-token.ts`
- `src/domain/repositories/user.ts`
