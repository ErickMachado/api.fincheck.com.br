# TASK-11: Rota de cadastro de usuário

Esta tarefa entrega a porta de entrada do produto: `POST /v1/users` recebe primeiro nome, último nome, e-mail e senha, cria o usuário em estado não ativado, emite o token de ativação e dispara o e-mail com o link. A resposta é `204` sem corpo tanto no cadastro novo quanto quando o e-mail já pertence a uma conta existente, e nesse segundo caso nada é criado nem enviado, para que a API não funcione como oráculo de quais endereços já possuem conta. O hash da senha é gerado antes de saber se o e-mail existe, conforme `DEC-07`, e a publicação na fila acontece só depois do commit, conforme `DEC-09`.

## Subtarefas

- [x] Criar `src/application/usecases/auth/create-user.ts` recebendo por injeção o `Transaction`, o `UserRepository`, o `ActivationRepository`, o `PasswordHasher` e o `Mailer`;
- [x] Normalizar o e-mail pelo objeto de valor `Email` e gerar o hash da senha antes de qualquer consulta de existência, para que o caminho do e-mail duplicado tenha custo de tempo semelhante ao do cadastro novo;
- [x] Gravar o usuário e a ativação dentro de um único `run` do `Transaction`, interrompendo sem erro quando `UserRepository.create` resolver para `false`;
- [x] Publicar o e-mail de ativação pelo `Mailer` apenas após o commit, passando primeiro nome, destinatário normalizado e o token em claro devolvido por `Activation.issue`;
- [x] Criar `src/application/controllers/users/create-user.ts` validando o corpo com Zod nas chaves `first_name`, `last_name`, `email` e `password`, com as regras de obrigatoriedade, aparo, 1 a 100 caracteres nos nomes, formato de e-mail com até 254 caracteres e senha de 8 a 64 caracteres, e traduzindo as chaves para a entrada do caso de uso;
- [x] Extrair para constantes nomeadas os limites de tamanho dos campos;
- [x] Devolver `204` sem corpo em caso de sucesso e deixar o erro de schema virar `400` com um ponteiro por campo inválido pelo tratador já existente;
- [x] Registrar a rota `POST /v1/users` em `src/main/router.ts` usando o adaptador de controllers e ligar o caso de uso na composição do `app.ts`;
- [x] Adicionar ao orquestrador de testes um utilitário de cadastro e um utilitário que extrai o token de ativação da mensagem entregue na caixa, para reuso pelas suítes seguintes;
- [x] Criar `tests/integration/api/users/create-user.spec.ts` com a suíte descrita como `POST /v1/users`, no formato AAA, iniciando o servidor no `beforeAll`, parando no `afterAll` e limpando o estado no `beforeEach`;
- [x] Gerar os dados de entrada dos testes com o `@faker-js/faker`, sem valores fixos, e manter cada caso independente de ordem e de estado criado por outro;
- [x] Cobrir os casos TU-01 a TU-09 e TU-14 a TU-18 conforme a tabela de testes da TechSpec;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-01
- CA-02
- CA-03
- CA-04
- CA-05
- CA-06
- CA-07
- CA-08
- CA-13
- CA-14
- CA-15
- CA-16
- CA-17

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

- [x] TU-01: Cadastro com dados válidos
- [x] TU-02: Estado do usuário logo após o cadastro
- [x] TU-03: Cadastro sem nenhum dos quatro campos obrigatórios
- [x] TU-04: Primeiro nome vazio e primeiro nome com 101 caracteres
- [x] TU-05: Último nome vazio e último nome com 101 caracteres
- [x] TU-06: E-mail em formato inválido
- [x] TU-07: Senha com 7 caracteres e senha com 65 caracteres
- [x] TU-08: Mensagem gerada pelo cadastro bem-sucedido
- [x] TU-09: Dois cadastros distintos em sequência
- [x] TU-14: Cadastro repetido com um e-mail já registrado
- [x] TU-15: Cadastro repetido com e-mail registrado e conta ainda não ativada
- [x] TU-16: Cadastro repetido com o mesmo e-mail em caixa alta
- [x] TU-17: Cadastro com apelido de e-mail derivado de um endereço já registrado
- [x] TU-18: Cadastro com apelido e capitalização mistas

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-10.md`
- `src/main/router.ts`
- `src/main/app.ts`
- `tests/setup/orchestrator.ts`
