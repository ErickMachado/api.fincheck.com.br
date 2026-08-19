# TASK-9: Ativação: caso de uso e controller de `POST /v1/auth/users/activations`

A verificação recebe apenas o token e não exige e-mail, senha ou qualquer credencial. Esta tarefa entrega o controller, que valida somente a presença e a não vacuidade do campo, e o caso de uso, que localiza o token pelo valor exato, decide pela entidade se ele ainda pode ser usado e o consome junto da marcação do e-mail como verificado. Token desconhecido, expirado e já utilizado produzem a mesma recusa, sem nenhuma distinção observável entre os três casos.

## Subtarefas

- [ ] Criar `src/application/controllers/auth/activate-user.ts` com o esquema Zod do corpo validando apenas que `token` é uma string presente e não vazia, sem exigir tamanho ou alfabeto
- [ ] Fazer o controller chamar `ActivateUserUseCase` e devolver `HTTPResponse` com `StatusCode.NoContent` e sem corpo
- [ ] Criar `src/application/usecases/auth/activate-user.ts` recebendo o `UserRepository` pelo construtor
- [ ] Buscar o token com `findActivationToken` e disparar a recusa genérica com `Problem.from` quando ele não existir ou quando `isUsable()` for falso, com título e detalhe idênticos nos dois casos
- [ ] Chamar `activateUser` e disparar exatamente a mesma recusa genérica quando ele devolver `false`, cobrindo o consumo concorrente do token
- [ ] Extrair em constantes o título e o detalhe da recusa, garantindo uma única mensagem para os três caminhos
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-17
- CA-18
- CA-19
- CA-20
- CA-21
- CA-22
- CA-23
- CA-31
- CA-33
- CA-34
- CA-35

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pela suíte de TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/application/controllers/auth/activate-user.ts`
- `src/application/usecases/auth/activate-user.ts`
- `src/common/http/problem.ts`
- `src/domain/repositories/user.ts`
