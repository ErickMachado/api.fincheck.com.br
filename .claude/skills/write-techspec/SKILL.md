---
name: write-techspec
description: Planeja soluções técnicas a partir de PRDs. Use quando o usuário quiser adicionar, modificar ou especificar funcionalidades de um produto ou projeto.
argument-hint: Forneça um slug de funcionalidade (ex: cadastro-de-usuarios)
---

## Objetivo

Arquitetar soluções técnicas a partir de um PRD.

## Use para

- Arquitetar soluções técnicas a partir de PRD;
- Editar especificações técnicas em andamento ou finalizados;

## NÃO use para

- Decompor a especificação técnicas em tarefas;
- Editar outros tipos de documentos;

## Regras

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- Evite linguagem vaga;
- NÃO solicite detalhes técnicos ao usuário;
- Pergunte só o que for necessário;
- Siga rigorosamente o template `./references/TEMPLATE.md` e NÃO altere sua estrutura;

## Entrada

O slug (identificador) de uma funcionalidade.

## Saída esperada

Documento markdown salvo em `.specs/[slug]/design.md` contendo toda a especificação gerada.

## Processo

1. Leia o PRD e identifique histórias de usuários e critérios de aceitação;
2. Leia as regras do projeto em `.claude/rules`;
3. Leia decisões técnicas de escopo global em `.specs/DECISIONS.md`;
4. Leia o código e identifique o estado atual do projeto;
5. Pesquise bibliotecas, estratégias e documentações relevantes ao que precisa ser construído;
6. Produza o documento;
7. Registre decisões técnicas de escopo global em `.specs/DECISIONS.md`;
