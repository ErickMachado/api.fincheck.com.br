---
name: orchestrate-tasks
description: Coordena a execução de tarefas técnicas a partir de um caminho crítico. Use quando o usuário solicitar a implementação de uma funcionalidade com especificação técnica.
argument-hint: Slug da funcionalidade
---

## Objetivo

Coordenar a execução de tarefas técnicas, distribuindo o trabalho paralelo para subagentes e mantendo um log da execução de cada tarefa.

## Use para

- Coordenar a execução de tarefas técnicas;

## NÃO use para

- Decompor tarefas ou subtarefas;
- Executar tarefas;

## Princípios

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- Mantenha o estado de execução de cada tarefa em `.specs/[slug]/state.json`;
- Delegue apenas uma tarefa por subagente;
- Verifique se o PR para a tarefa foi aberto mas NÃO revise o código e NÃO execute os portões de qualidade;

## Entrada

O slug da funcionalidade.

## Saída esperada

Todas as tarefas da funcionalidade concluídas.

## Processo

1. Leia o planejamento das tarefas em `.specs/[slug]/tasks.md` e identifique o caminho crítico e ondas;
2. Selecione a próxima tarefa disponível;
3. Crie uma branch e uma worktree para a tarefa. O nome da branch deve seguir rigorosamente o padrão `feature/[slug]/task-*`;
4. Delegue a tarefa para um subagente. Forneça o ID da tarefa, nome da branch/worktree e peça para o subagente notificar assim que tarefa estiver concluída;
5. Assim que o subagente notificar a finalização, marque a tarefa com concluída em `.specs/[slug]/state.json`;
6. Volte para o passo 2 e repita até que todas as tarefas estejam completas;
