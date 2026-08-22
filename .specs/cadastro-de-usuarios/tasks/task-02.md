# TASK-02: Núcleo HTTP e adaptador de controllers

As duas rotas da funcionalidade respondem `204` sem corpo e a ativação responde `422` para token inválido, expirado ou consumido, mas o `StatusCode` atual só conhece `400` e `500` e o `Problem` só sabe montar erros de validação e erro interno. Esta tarefa completa o núcleo HTTP comum e cria a fronteira que mantém a camada `application` livre do Fastify: um contrato `Controller` em `common` e um adaptador em `main` que traduz esse contrato para um handler do framework, conforme `DEC-12`.

## Subtarefas

- [x] Adicionar `NoContent` (`204`) e `UnprocessableContent` (`422`) ao enum `StatusCode` em `src/common/http/statuses.ts`;
- [x] Exportar o tipo `Details` em `src/common/http/problem.ts`;
- [x] Adicionar a fábrica pública estática `create` em `Problem`, recebendo `Details`, para que erros conhecidos sejam disparados sem criar classes de erro customizadas;
- [x] Criar `src/common/http/controller.ts` declarando os tipos `HTTPRequest` (`body`, `params`, `query`) e `HTTPResponse` (`body` opcional, `status`) e a interface `Controller`, conforme o contrato da TechSpec;
- [x] Criar `src/main/adapters/controller.ts` convertendo um `Controller` em handler do Fastify: repassar `body`, `params` e `query` da requisição, aplicar o `status` retornado e enviar o corpo apenas quando ele existir, deixando a resposta vazia nos casos de `204`;
- [x] Garantir que o adaptador deixe os erros propagarem para o `setErrorHandler` já registrado em `src/main/plugins/problem.ts`, sem `try-catch` próprio;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- `-`

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `src/common/http/statuses.ts`
- `src/common/http/problem.ts`
- `src/main/plugins/problem.ts`
- `src/main/app.ts`
