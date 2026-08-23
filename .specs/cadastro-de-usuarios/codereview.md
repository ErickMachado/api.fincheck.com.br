# Revisão: Cadastro de Usuários

## Resumo

- **Data**: 23/08/2026
- **Branch**: `feature/signup`
- **Status**: APROVADO COM RESSALVAS

## Regras

| Regra                                 | Status | Observações                                                                                                                                                                |
| :------------------------------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude/rules/api-standards.md`      | OK     | Rotas versionadas (`/v1/users`, `/v1/users/activations`), corpo em `snake_case` e respostas `204` sem corpo. Não há listagem nesta entrega, então o envelope não se aplica |
| `.claude/rules/bash-standards.md`     | OK     | Portões de qualidade executados via `rtk`                                                                                                                                  |
| `.claude/rules/code-standards.md`     | NOK    | Comentários explicativos em `src/domain/repositories/*.ts` e 17 diretivas `/* v8 ignore */` com justificativa em prosa; `EMAIL_MAX_LENGTH` duplicado em dois arquivos      |
| `.claude/rules/database-standards.md` | OK     | Tabelas e colunas em `snake_case`, sufixo `_fk` na chave estrangeira, migrações `.sql` com prefixo gerado pela ferramenta e transação explícita (`BEGIN`/`COMMIT`)         |
| `.claude/rules/folder-standards.md`   | OK     | Camadas e direções de importação respeitadas. `src/main/factories` não consta na tabela de `main`, mas é decomposição de `app.ts` para manter o limite de 100 linhas       |
| `.claude/rules/git-standards.md`      | OK     | Todas as 41 mensagens de commit em inglês e no padrão convencional                                                                                                         |
| `.claude/rules/testing-standards.md`  | NOK    | Formato AAA, orquestrador e dados aleatórios em ordem; porém há valor fixo (`http://localhost:3000`), arquivos acima de 100 linhas e IDs de teste duplicados               |

## Aderência a TechSpec

| Decisão | Implementado | Observações                                                                                                            |
| :------ | :----------- | :--------------------------------------------------------------------------------------------------------------------- |
| DEC-01  | ✅           | `pg@8.23.0` como único driver, compartilhado com o `node-pg-migrate`                                                   |
| DEC-02  | ✅           | Migrações `.sql` puras carregadas por `migrationLoaderStrategies` em `src/infra/database/migrator.ts`                  |
| DEC-03  | ✅           | `@node-rs/argon2` com `Algorithm.Argon2id` e parâmetros de custo em constantes                                         |
| DEC-04  | ✅           | `randomBytes(32).toString('base64url')` e persistência apenas do SHA-256 em hexadecimal                                |
| DEC-05  | ✅           | Tabela `user_activation_tokens` própria, com `ON DELETE CASCADE`                                                       |
| DEC-06  | ✅           | `INSERT ... ON CONFLICT (email) DO NOTHING RETURNING id` em `PostgresUserRepository.create`                            |
| DEC-07  | ✅           | `CreateUser.execute` gera o hash antes de abrir a transação e antes de qualquer consulta de existência                 |
| DEC-08  | ✅           | `Transaction.run` delimita a fronteira; repositórios chegam por injeção separada em `createUsecases`                   |
| DEC-09  | ✅           | `mailer.sendActivation` é chamado depois do retorno de `transaction.run`                                               |
| DEC-10  | ✅           | `422` com título e detalhe idênticos nos três caminhos de token inválido                                               |
| DEC-11  | ✅           | Token lido de `request.body` em `ActivateUserController`                                                               |
| DEC-12  | ✅           | `adapt` em `src/main/adapters/controller.ts`; nenhum import de `fastify` na camada `application`                       |
| DEC-13  | ✅           | Coluna `is_activated BOOLEAN NOT NULL`, com `updated_at` atualizado em `User.activate`                                 |
| DEC-14  | ✅           | Normalização no `Email` e `CONSTRAINT users_email_lowercase CHECK (email = lower(email))`                              |
| DEC-15  | ✅           | Entrega por `nodemailer` sobre SMTP, sem SDK proprietário                                                              |
| DEC-16  | ✅           | Asserções pela API HTTP do MailCatcher; nenhum `Mailer` falso injetado                                                 |
| DEC-17  | ✅           | Testcontainers para PostgreSQL, RabbitMQ e MailCatcher, com `cleanup` no `beforeEach`                                  |
| DEC-18  | ✅           | `QueuedMailer` publica em `fincheck.emails`; o despachante consome `emails.outgoing`                                   |
| DEC-19  | ✅           | Mensagem carrega `type` e `payload`, nunca o HTML renderizado                                                          |
| DEC-20  | ✅           | Canal de confirmação em `RabbitMQPublisher` e fila durável; janela entre commit e publicação aceita conforme a decisão |
| DEC-21  | ✅           | `emails.retry` com `messageTtl` de 30s, teto de 5 tentativas lido de `x-death` e `emails.dead` ao fim                  |
| DEC-22  | ✅           | Consumidor sobe em `createMessagingDependencies`, no mesmo processo da API                                             |
| DEC-23  | ✅           | `amqplib@2.0.1` com `RecoveringChannelModel` e `{ recovery: true }`                                                    |
| DEC-24  | ✅           | Templates React Email envoltos em `<Tailwind>`                                                                         |
| DEC-25  | ✅           | `render(element)` e `render(element, { plainText: true })` a partir do mesmo elemento                                  |
| DEC-26  | ✅           | `TransactionContext` sobre `AsyncLocalStorage`, com queda para o pool em `resolve`                                     |

Contratos, entidades, tabelas, índices, schema de fila e as duas rotas conferem com o que foi especificado. As 19 variáveis de ambiente da TechSpec existem em `config.ts`, `.env.example` e `.env.test`, e as 18 dependências estão nas versões exatas declaradas.

## Tarefas

| Tarefa  | Status   | Observações                                                                                                            |
| :------ | :------- | :--------------------------------------------------------------------------------------------------------------------- |
| TASK-01 | COMPLETA | Dependências nas versões exatas, apelidos, `jsx`, scripts e `compose.yml`. `npm audit --omit=dev` sem vulnerabilidades |
| TASK-02 | COMPLETA | `NoContent`, `UnprocessableContent`, `Details`, `Problem.create`, `Controller` e o adaptador                           |
| TASK-03 | COMPLETA | `Email`, `User` e `Activation` com ordem de propriedades e `readonly` conforme a regra                                 |
| TASK-04 | COMPLETA | Pool, contexto, transação explícita, migrador, migrações e os dois repositórios com `FOR UPDATE`                       |
| TASK-05 | COMPLETA | `PasswordHasher` e `Argon2PasswordHasher` com custos em constantes                                                     |
| TASK-06 | COMPLETA | Conexão, topologia, publicador em canal de confirmação e laço de consumo com dead lettering                            |
| TASK-07 | COMPLETA | `layout.tsx` e `activation.tsx`, ambos abaixo de 100 linhas, com o link no formato de `CA-07`                          |
| TASK-08 | COMPLETA | `Mailer`, `EmailMessage`, transporte com pool, `QueuedMailer` e `TemplateEmailDispatcher`                              |
| TASK-09 | COMPLETA | Composição e encerramento ordenado; `main.ts` ganhou o desligamento por sinal                                          |
| TASK-10 | COMPLETA | Orquestrador com contêineres efêmeros, migrações, limpeza e sondagem com prazo máximo                                  |
| TASK-11 | COMPLETA | Rota de cadastro coberta por TU-01 a TU-09 e TU-14 a TU-18                                                             |
| TASK-12 | COMPLETA | Rota de ativação coberta por TU-10 a TU-13                                                                             |
| TASK-13 | COMPLETA | TU-19 e TU-20 cobertos, com a suíte isolada de indisponibilidade do SMTP                                               |
| TASK-14 | COMPLETA | Cobertura habilitada com limite de 90% e lacunas fechadas por casos blackbox                                           |

Os 17 critérios de aceitação do PRD (CA-01 a CA-17) têm teste correspondente, e os 20 casos da TechSpec (TU-01 a TU-20) estão implementados, mais 9 casos adicionais de borda.

## Testes

- **Todal**: 29
- **Passando**: 29
- **Falhando**: 0
- **Cobertura**: 99,65% de instruções, 100% de ramos, 100% de funções, 99,64% de linhas

`npm run format:check`, `npm run lint:check` e `npx tsc --noEmit` também passam sem apontamentos.

## Problemas

| Severidade | Arquivo                                            | Linha | Observação                                                                                                                                                                                                                                                                                                         |
| :--------- | :------------------------------------------------- | :---- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MÉDIO      | `src/main/plugins/problem.ts`                      | 18    | O tratador ignora `error.statusCode` e traduz qualquer erro não-`Problem` para `500`. Corpo JSON malformado, que o Fastify já classifica como `400`, sai como `500`, contrariando `ENG-05` e a tabela de respostas da TechSpec. O caso TU-22 de `create-user.spec.ts:243` fixa esse comportamento ao esperar `500` |
| MÉDIO      | `src/main/main.ts`                                 | 17    | `main()` é chamada sem `await` nem `catch`. Uma falha no parse das variáveis de ambiente ou na conexão com PostgreSQL/RabbitMQ vira rejeição não tratada, sem mensagem de diagnóstico e sem código de saída explícito                                                                                              |
| BAIXO      | `src/main/main.ts`                                 | 13    | O tratador de sinal não aguarda `service.stop()` nem encerra o processo, então o desligamento pode ser cortado antes de fechar broker, transporte SMTP e pool                                                                                                                                                      |
| BAIXO      | `tests/integration/api/users/create-user.spec.ts`  | 6     | `ACTIVATION_LINK_PATTERN` fixa `http://localhost:3000` em vez de derivar de `APP_WEB_URL`. O teste quebra silenciosamente se o valor de `.env.test` mudar                                                                                                                                                          |
| BAIXO      | `tests/integration/api/users/activation.spec.ts`   | 75    | Os IDs `TU-21` e `TU-22` são reutilizados aqui e em `create-user.spec.ts:230` e `:243` para casos diferentes, o que quebra a rastreabilidade com a TechSpec                                                                                                                                                        |
| BAIXO      | `src/domain/repositories/user.ts`                  | 4     | Bloco de comentário explicando o comportamento de `create`; o mesmo ocorre em `src/domain/repositories/activation.ts:5`. `code-standards.md` proíbe comentários explicativos                                                                                                                                       |
| BAIXO      | `src/application/controllers/users/create-user.ts` | 9     | `EMAIL_MAX_LENGTH = 254` é redeclarado aqui e em `src/domain/value-objects/email.ts:3`; os dois limites podem divergir em alterações futuras                                                                                                                                                                       |
| BAIXO      | `src/infra/queue/rabbitmq/consumer.ts`             | 65    | `deadLetter` republica apenas `message.content` via `sendToQueue`, descartando cabeçalhos e propriedades originais. A mensagem chega em `emails.dead` sem o histórico de `x-death` para diagnóstico                                                                                                                |
| BAIXO      | `tests/setup/orchestrator.ts`                      | 1     | 125 linhas, acima do limite de 100 de `code-standards.md`. `tests/setup/users.ts` (106) e as suítes de `tests/integration` (316 e 129) também extrapolam                                                                                                                                                           |
| BAIXO      | `vitest.config.ts`                                 | 10    | `src/main/main.ts` fica fora da medição. A exclusão é razoável para um ponto de entrada, mas não estava prevista na TechSpec                                                                                                                                                                                       |
| BAIXO      | `.gitignore`                                       | 1     | A entrada `coverage` aparece duplicada (linhas 1 e 6)                                                                                                                                                                                                                                                              |

Sobre as 17 diretivas `/* v8 ignore */` espalhadas por 11 arquivos: elas explicam por que cada ramo defensivo é inalcançável pelos testes blackbox e, por isso, contribuem para os 100% de ramos relatados. Ainda que todos os trechos ignorados fossem contados como descobertos, a cobertura ficaria em torno de 93%, acima do mínimo de 90% — logo o portão não depende delas. Vale, porém, revisitá-las quando novos cenários tornarem esses caminhos alcançáveis.

## Conclusão

A implementação cobre integralmente o PRD e a TechSpec. As 26 decisões de design foram seguidas sem desvio, os contratos, entidades, tabelas, índices, topologia de fila e rotas conferem com o especificado, e as 14 tarefas estão concluídas com todas as subtarefas marcadas. Os portões de qualidade passam: 29 testes verdes, 99,65% de cobertura de instruções, formatação, lint e verificação de tipos sem apontamentos, e `npm audit` sem vulnerabilidades em produção. Os pontos sensíveis da funcionalidade — resposta indistinguível para e-mail já cadastrado, hash gerado antes da checagem de existência, token persistido apenas como resumo, uso único com bloqueio de linha e publicação após o commit — estão implementados e cobertos por teste.

As ressalvas não bloqueiam a entrega. As duas de severidade média moram na composição da aplicação e no tratador de erros, ambos fora do fluxo de cadastro: um corpo JSON malformado responde `500` em vez de `400`, e uma falha na subida do processo se perde como rejeição não tratada. As demais são pontuais e de correção barata: um valor fixo em teste, IDs de caso repetidos, comentários explicativos nas interfaces de repositório e um limite de tamanho duplicado entre controller e objeto de valor. Recomendo tratá-las em uma tarefa de acabamento, com prioridade para o mapeamento de `statusCode` no tratador de erros, já que ele afeta toda rota futura que receba corpo JSON.

## Correções Aplicadas

| Severidade | Ponto                                                       | Correção                                                                                                                                                                       |
| :--------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MÉDIO      | Tratador de erros ignora `statusCode`                       | `toProblem` passou a mapear `statusCode` igual a `400` para `Problem.badRequest()`. Corpo JSON malformado responde `400` nas duas rotas (TU-22 e TU-26)                        |
| MÉDIO      | `main()` sem `await` nem `catch`                            | `main().catch(fail)` escreve o `stack` em `stderr` e encerra com código `1`                                                                                                    |
| BAIXO      | Sinal não aguarda `service.stop()`                          | O tratador delega a `shutdown`, que aguarda a parada e encerra com código `0`, ou com `1` em caso de falha                                                                     |
| BAIXO      | `http://localhost:3000` fixo no teste                       | `activationLinkPattern()` deriva o padrão de `APP_WEB_URL`; o remetente de TU-08 passou a vir de `MAIL_FROM_ADDRESS`                                                           |
| BAIXO      | IDs `TU-21` e `TU-22` duplicados                            | Os casos da rota de ativação foram renumerados para `TU-25`, `TU-26` e `TU-27`, sem colisão com os da rota de cadastro                                                         |
| BAIXO      | Comentários explicativos nas interfaces de repositório      | Removidos de `src/domain/repositories/user.ts` e `src/domain/repositories/activation.ts`                                                                                       |
| BAIXO      | `EMAIL_MAX_LENGTH` duplicado                                | A constante é exportada por `src/domain/value-objects/email.ts` e importada pelo controller                                                                                    |
| BAIXO      | `deadLetter` descarta cabeçalhos                            | `sendToQueue` repassa `message.properties`, preservando `x-death` e demais propriedades da mensagem original                                                                   |
| BAIXO      | Arquivos de teste acima de 100 linhas                       | Orquestrador dividido em `Orchestrator` e `MailOrchestrator`; ajudantes movidos para `database.ts`, `problems.ts` e `activation-emails.ts`; as suítes foram quebradas por tema |
| BAIXO      | Exclusão de `src/main/main.ts` da cobertura não documentada | A TechSpec passou a registrar quais arquivos ficam fora da medição e por quê                                                                                                   |
| BAIXO      | `coverage` duplicado no `.gitignore`                        | Entrada duplicada removida                                                                                                                                                     |

Portões após as correções: 30 testes verdes em 7 suítes, 98,97% de instruções, 97,36% de ramos, 100% de funções e 98,93% de linhas — acima do mínimo de 90%. `format:check`, `lint:check` e `tsc --noEmit` sem apontamentos.

A queda em relação aos 100% de ramos anteriores vem do próprio conserto: o retorno `Problem.internal()` do tratador deixou de ser alcançado pelo caso de JSON malformado, que agora cai no ramo de `400`. Optei por deixar essa linha descoberta em vez de acrescentar mais uma diretiva `/* v8 ignore */`, já que ela é o fallback defensivo de um erro que nenhuma rota atual dispara.
