---
name: implement-tasks
description: Implementa tarefas técnicas e abre Pull Requests. Use quando o usuário ou outro agente solicitar a implementação de tarefas.
argument-hint: Slug da funcionalidade e ID da tarefa
---

## Objetivo

Executar tarefas técnicas planejadas até que todas estejam concluídas.

## Use para

- Executar tarefas técnicas;

## NÃO use para

- Decompor tarefas ou subtarefas;

## Regras

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- Todos os recursos alocados para a tarefa (portas, containers, etc.) devem ser liberados ao final;

## Entrada

O slug da funcionalidade, ID da tarefa e branch/worktree.

## Saída esperada

PR aberto no GitHub.

## Processo

1. Leia o arquivo da tarefa em `.specs/[slug]/tasks/task-*.md`;
2. Leia o PRD, a TechSpec, regras e skills relavantes para o escopo da tarefa;
3. Se necessário, execute os containers Docker, rode migrações e suba o servidor HTTP. Se receber erros relacionado a "porta em uso", seleciona próxima porta disponível na faixa do serviço (ex: `4000-4999` para a API e `5432-5999` para Postgres);
4. Execute cada subtarefa na exata ordem declarada. Após concluir, marque a subtarefa como concluída e pule para a próxima até completar todas;
5. Passe a tarefa pelos portões de qualidade (testes, formatador, linter, etc.). Caso alguma checagem falhe, volte e faça a correção até tudo passar;
6. Pare todos os serviços iniciados e libere todas as portas. NÃO encerre processos do usuário ou de outras worktrees;
7. Faça commits atômicos e abra o PR;
