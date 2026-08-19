---
name: execute-tasks
description: Executa tarefas técnicas em uma worktree isolada e abre um Pull Request ao terminar. Use quando o usuário solicitar a implementação de uma funcionalidade.
argument-hint: Slug da funcionalidade
---

## Objetivo

Executar tarefas técnicas planejadas até que todas estejam concluídas.

## Use para

- Executar tarefas técnicas;

## NÃO use para

- Decompor tarefas ou subtarefas;

## Regras

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- No momento de selecionar a tarefa, sempre leve em consideração o caminho crítico e as dependências;
- Toda tarefa deve ser feita em um worktree isolado a partir da branch da funcionalidade;
- Todos os recursos alocados para a tarefa (portas, containers, etc.) devem ser liberados ao final;
- A tarefa deve passar em todos os portões de qualidade;
- Use o recurso de Stacked Pull Requests do GitHub para empilhar o PR;

## Entrada

O slug de uma funcionalidade.

## Saída esperada

- PR aberto;

## Processo

1. Atualize a branch da funcionalidade;
2. Leia o arquivo `.specs/[slug]/tasks.md`, selecione a próxima tarefa disponível, marque como "Em Progresso" e suba para o repositório remoto;
3. Leia o PRD, a TechSpec, regras e skills relavantes para o escopo da tarefa;
4. Atualize a branch da funcionalidade e crie uma nova para a tarefa (ex: `feature/[slug]` &lt;- `feature/[slug]/task-*`)
5. Leia o arquivo da tarefa em `.specs/[slug]/tasks/task-*.md`;
6. Se necessário, execute os containers Docker, rode migrações e suba o servidor HTTP. Se receber erros relacionado a "porta em uso", seleciona próxima porta disponível na faixa do serviço (ex: `4000-4999` para a API e `5432-5999` para Postgres);
7. Execute cada subtarefa na exata ordem declarada. Após concluir, marque a subtarefa como concluída e pule para a próxima até todas estarem concluídas;
8. Passe a tarefa pelos portões de qualidade (testes, formatador, linter, etc.). Caso alguma checagem falhe, volte e faça a correção até tudo passar;
9. Pare todos os serviços iniciados e libere todas as portas. NÃO encerre processos do usuário ou de outras worktrees;
10. Faça commits atômicos e abra o PR;
