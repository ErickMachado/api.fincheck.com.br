---
name: write-tasks
description: Decomponha especificações técnicas em tarefas de escopo bem definido.
argument-hint: Slug da funcionalidade
---

## Processo

### 1. Contexto

O objetivo dessa etapa é reunir o máximo de informações sobre o que precisa ser feito. Leia o PRD e a TechSpec da funcionalidade, bem como as skills em `.claude/rules/*.md` e as skills em `.claude/skills/*.md`.

Considere essa etapa concluída quando tiver pleno entendimento sobre o que precisar ser construído.

### 2. Decomposição

Toda a informação reunida na etapa 1 agora deve ser organizada em tarefas de escopo bem definido. Leia o arquivo [TEMPLATE.md](./references/TEMPLATE.md) e aplique as informações nesse template. Siga rigorosamente a estrutura e NÃO adicione seções ou informações, porém, Você pode esconder seções que não se aplicarem ao contexto da tarefa.

Crie um caminho crítico das tarefas, evidenciando quais podem ser feitas em paralelo e quais as dependências entre elas.

Considere essa etapa concluída quando o documento estiver salvo em `.specs/features/[nome]/tasks.md`.
