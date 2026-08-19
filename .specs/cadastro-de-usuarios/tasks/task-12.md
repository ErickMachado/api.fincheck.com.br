# TASK-12: Suíte blackbox de `POST /v1/auth/users`

Esta tarefa cobre o cadastro de ponta a ponta a partir da rota HTTP, com PostgreSQL e SMTP reais fornecidos pelo orquestrador. Além do caminho feliz e de toda a validação de entrada, a suíte prova as duas garantias de segurança do fluxo: a mensagem de ativação vai a um único destinatário com o link no formato acordado, e a resposta de um cadastro com e-mail já existente é indistinguível da de um cadastro inédito, sem criar conta nem enviar mensagem alguma.

## Subtarefas

- [ ] Criar `tests/integration/api/auth/create-user.spec.ts` com a suíte descrita como `POST /v1/auth/users`
- [ ] Chamar o orquestrador em `beforeAll`, `afterAll` e `beforeEach`, sem subir contêineres, rodar migrações ou limpar estado dentro do arquivo de teste
- [ ] Escrever os casos do caminho feliz e do contrato de resposta: TU-1, TU-2 e TU-3
- [ ] Escrever os casos de validação de campos ausentes e fora do formato: TU-4 a TU-10
- [ ] Escrever os casos de aparagem de espaços e de tratamento da senha: TU-11 a TU-14
- [ ] Escrever os casos da mensagem de ativação, lidos pela caixa do MailCatcher: TU-15 e TU-16
- [ ] Escrever os casos do token gerado no cadastro: TU-17 e TU-18
- [ ] Escrever os casos de normalização do endereço de e-mail: TU-26 e TU-27
- [ ] Escrever os casos de e-mail já existente e de indistinguibilidade das respostas: TU-28 a TU-32
- [ ] Estruturar todos os casos no formato AAA, com dados vindos de `tests/mocks/users.ts` e sem depender de ordem de execução, relógio atual ou estado criado por outro teste
- [ ] Executar `npm run test` ao menos três vezes seguidas, conferindo que a suíte passa em todas e que a cobertura sobre `src` atinge o limiar de 90%
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-2
- CA-3
- CA-4
- CA-5
- CA-6
- CA-7
- CA-8
- CA-9
- CA-10
- CA-11
- CA-12
- CA-13
- CA-14
- CA-15
- CA-16
- CA-24
- CA-25
- CA-26
- CA-27
- CA-28
- CA-29
- CA-30
- CA-32
- CA-34

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/testing-standards.md`

## Testes

- [ ] TU-1: Cadastro com dados válidos cria a conta
- [ ] TU-2: Corpo da resposta de cadastro bem-sucedido
- [ ] TU-3: Cadastro bem-sucedido não abre sessão
- [ ] TU-4: Cadastro omitindo `first_name`, `last_name`, `email` e `password`, um de cada vez
- [ ] TU-5: Cadastro com `first_name` de 1 e de 101 caracteres
- [ ] TU-6: Cadastro com `last_name` de 1 e de 101 caracteres
- [ ] TU-7: Cadastro com senha de 7 e de 65 caracteres
- [ ] TU-8: Cadastro com senha de 8 caracteres só de minúsculas e sem símbolos
- [ ] TU-9: Cadastro com e-mail sem `@`, sem domínio e com espaço interno
- [ ] TU-10: Cadastro com nome curto, sobrenome curto, e-mail inválido e senha curta na mesma requisição
- [ ] TU-11: Cadastro com espaços nas bordas de `first_name`, `last_name` e `email`
- [ ] TU-12: Cadastro com `first_name` e `last_name` compostos apenas por espaços
- [ ] TU-13: Cadastro com `first_name` de exatamente 100 caracteres cercado por espaços
- [ ] TU-14: Cadastro com senha de 8 caracteres contendo espaços nas bordas e com 65 caracteres contando os espaços
- [ ] TU-15: Mensagem de ativação recebida pelo MailCatcher após um cadastro bem-sucedido
- [ ] TU-16: Link contido na mensagem de ativação, nas partes HTML e texto puro
- [ ] TU-17: Tokens de dois cadastros distintos
- [ ] TU-18: Validade gravada para o token
- [ ] TU-26: Cadastro com `Erick+Trabalho@Fincheck.com.br` em base vazia
- [ ] TU-27: Cadastro com `er.ick@fincheck.com.br` havendo `erick@fincheck.com.br`
- [ ] TU-28: Cadastro repetindo exatamente um e-mail já existente, com nome e senha diferentes
- [ ] TU-29: Cadastro com `ERICK@FINCHECK.COM.BR`, `erick+1@fincheck.com.br` e o endereço cercado por espaços sobre conta existente
- [ ] TU-30: Caixa do MailCatcher após cadastro com e-mail já existente
- [ ] TU-31: Novo cadastro sobre conta ainda não verificada e uso posterior do token original
- [ ] TU-32: Comparação entre a resposta de um cadastro inédito e a de um cadastro com e-mail existente

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `tests/integration/api/auth/create-user.spec.ts`
- `tests/setup/orchestrator.ts`
- `tests/setup/mailbox.ts`
- `tests/mocks/users.ts`
