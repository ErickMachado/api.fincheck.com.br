# TASK-3: Núcleo HTTP: contrato de controller, `204 No Content` e adaptador do Fastify

Os controllers da camada `application` não podem conhecer o Fastify, e o único status de sucesso das duas rotas é `204`, que o enum atual não declara. Esta tarefa entrega o contrato `Controller` com `HTTPRequest` e `HTTPResponse`, acrescenta `NoContent` ao `StatusCode`, adiciona ao `Problem` a fábrica genérica que dispara erros conhecidos sem criar classes de erro customizadas e implementa o adaptador que traduz um `Controller` em um handler do Fastify.

## Subtarefas

- [ ] Criar `src/common/http/controller.ts` declarando os tipos `HTTPRequest` (com `body`, `params` e `query` como `unknown`) e `HTTPResponse` (com `body` opcional e `status`) e a interface `Controller`
- [ ] Adicionar `NoContent = 204` ao enum `StatusCode` em `src/common/http/statuses.ts`
- [ ] Adicionar a fábrica estática `Problem.from` em `src/common/http/problem.ts`, recebendo `title`, `detail` e `status` em um objeto e devolvendo um `Problem`
- [ ] Criar `src/main/adapters/controller.ts` convertendo `FastifyRequest` em `HTTPRequest`, chamando `handle` e respondendo pelo `FastifyReply` com o status devolvido, sem enviar corpo quando o status for `204`
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-32
- CA-33
- CA-34

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pelas suítes de TASK-12 e TASK-13.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/common/http/controller.ts`
- `src/common/http/statuses.ts`
- `src/common/http/problem.ts`
- `src/main/adapters/controller.ts`
- `src/main/plugins/problem.ts`
