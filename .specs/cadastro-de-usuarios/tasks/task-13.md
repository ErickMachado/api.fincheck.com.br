# TASK-13: Suíte blackbox de `POST /v1/auth/users/activations`

Esta tarefa cobre a verificação de e-mail de ponta a ponta a partir da rota HTTP. Além do caminho feliz, a suíte prova as garantias que sustentam o token: ele vale por um único uso, expira em 15 minutos, é comparado exatamente como consta no link e afeta apenas a conta que o originou. Prova também que token desconhecido, expirado e já utilizado produzem respostas indistinguíveis entre si e que a verificação não devolve credencial nem abre sessão.

## Subtarefas

- [ ] Criar `tests/integration/api/auth/activate-user.spec.ts` com a suíte descrita como `POST /v1/auth/users/activations`
- [ ] Chamar o orquestrador em `beforeAll`, `afterAll` e `beforeEach`, sem subir contêineres, rodar migrações ou limpar estado dentro do arquivo de teste
- [ ] Escrever os casos do caminho feliz e do contrato de resposta: TU-19, TU-20, TU-34 e TU-35
- [ ] Escrever os casos de recusa por token inexistente, expirado, já consumido e alterado: TU-21 a TU-24
- [ ] Envelhecer o `expires_at` pelo orquestrador no caso de expiração, sem relógio falso
- [ ] Escrever o caso de isolamento entre contas não verificadas: TU-25
- [ ] Escrever o caso de indistinguibilidade entre as três recusas e o de validação do campo `token`: TU-33 e TU-36
- [ ] Estruturar todos os casos no formato AAA, com dados vindos de `tests/mocks/users.ts` e sem depender de ordem de execução, relógio atual ou estado criado por outro teste
- [ ] Executar `npm run test` ao menos três vezes seguidas, conferindo que a suíte passa em todas e que a cobertura sobre `src` atinge o limiar de 90%
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
- `.claude/rules/testing-standards.md`

## Testes

- [ ] TU-19: Verificação com token válido dentro da validade
- [ ] TU-20: Verificação enviando somente `token`, sem e-mail, senha ou cabeçalho de autenticação
- [ ] TU-21: Verificação com token inexistente
- [ ] TU-22: Verificação com token cuja validade foi envelhecida pelo orquestrador
- [ ] TU-23: Verificação repetindo um token já consumido
- [ ] TU-24: Verificação com o token em caixa alta e com um caractere trocado
- [ ] TU-25: Verificação com o token de uma entre duas contas não verificadas
- [ ] TU-33: Comparação entre as respostas de token desconhecido, expirado e já utilizado
- [ ] TU-34: Corpo da resposta de verificação bem-sucedida
- [ ] TU-35: Verificação bem-sucedida não abre sessão
- [ ] TU-36: Verificação omitindo o campo `token` e enviando-o vazio

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `tests/integration/api/auth/activate-user.spec.ts`
- `tests/setup/orchestrator.ts`
- `tests/mocks/users.ts`
