---
name: write-tasks
description: Decomponha especificações técnicas em tarefas de escopo bem definido.
argument-hint: Slug da funcionalidade
---

## Processo

### 1. Contexto

#### O que deve ser feito:

Leia o PRD e o arquivo de design da funcionalidade. Leia os arquivos de regras em `.claude/rules` e habilidades em `.claude/skills`.

#### Objetivo:

Reunir o máximo de informações sobre o que precisa ser construído e as regras do projeto.

#### Concluído quando:

Todas as histórias de usuários, critérios de aceitação e definições de design estiverem identificados.

### 2. Decomposição

#### O que deve ser feito:

Leia o arquivo `./references/TEMPLATE_TASK.md` e crie tarefas com escopos claros, dependências explícitas e testes próprios. Siga rigorosamente a estrutura e NÃO adicione seções ou informações. Entretanto, você pode esconder seções que não se aplicarem.

#### Objetivo:

Decompor uma especificação técnica em tarefas menos de escopo bem definido.

#### Concluído quando:

Todas as tarefas estiverem salvas em seus respectivos arquivos em `.specs/[slug]/tasks/[t*].md`.

### 3. Análise de Dependências

#### O que deve ser feito:

Analise as tarefas criadas e identifique as dependências entre elas. Quebre em ondas de implementações. Leia o arquivo `./references/TEMPLATE_KANBAN.md` e aplique as informações nele. Siga rigorosamente a estrutura e NÃO adicione seções ou informações. Entretanto, você pode esconder seções que não se aplicarem.

#### Objetivo:

Deixar explícito a dependência entre as tarefas e quais devem ser executadas primeiro.

#### Concluído quando:

Todas as tarefas estiverem declaradas em `.specs/[slug]/tasks.md`.
