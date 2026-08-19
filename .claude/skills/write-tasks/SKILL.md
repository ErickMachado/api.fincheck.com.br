---
name: write-tasks
description: Cria tarefas técnicas de escopo bem definido analisa a dependência entre elas. Use quando o usuário quiser decompor uma especificação técnica.
argument-hint: Slug da funcionalidade
---

## Objetivo

Estruturar solicitações de funcionalidades em PRDs claros, acionáveis e de escopo bem definido.

## Use para

- Criar tarefas técnicas;
- Criar o caminho crítico entre tarefas;
- Dividir a execução das tarefas em ondas;

## NÃO use para

- Executar as tarefas;
- Editar documentos;

## Regras

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- Não crie tarefas que não estejam dentro do escopo do PRD e TechSpec;
- Evite linguagem vaga;
- Toda tarefa deve ter o escopo bem definido e suas dependências explícitas;
- Siga rigorosamente o template `./references/TEMPLATE_TASK.md` e NÃO altere sua estrutura;
- Siga rigorosamente o template `./references/TEMPLATE_KANBAN.md` e NÃO altere sua estrutura;

## Entrada

O slug de uma funcionalidade.

## Saída esperada

- Documento markdown salvo em `.specs/[slug]/tasks.md`;
- Documento markdown salvo em `.specs/[slug]/tasks/task-*.md`;

## Processo

1. Leia o PRD e a TechSpec. Identifique histórias de usuários e critérios de aceitação;
2. Leia as regras do projeto em `.claude/rules` e as skills `.claude/skills`;
3. Decomponha cada tarefa em seu próprio arquivo;
4. Crie o caminho crítico entre as tarefas e divida a execução em ondas;
