---
name: write-prd
description: Transforma solicitações não estruturadas de novas funcionalidades ou alterações em funcionalidades existentes em um documento de requisitos do produto (PRD). Use quando o usuário quiser adicionar, modificar ou especificar funcionalidades de um produto ou projeto.
argument-hint: Descreva o que precisa ser feito e os comportamentos e resultados esperados
---

## Objetivo

Estruturar solicitações de funcionalidades em PRDs claros, acionáveis e de escopo bem definido.

## Use para

- Especificar mudanças de comportamentos em funcionalidades existentes;
- Especificar de novas funcionalidades;
- Editar PRDs em andamento ou finalizados

## NÃO use para

- Especificar mudanças técnicas;
- Editar outros tipos de documentos;

## Regras

- Todos os logs, perguntas e respostas devem estar em PT-BR;
- Não invente requisitos;
- Preserve a intenção original do usuário;
- Evite linguagem vaga;
- NÃO presuma e NÃO solicite detalhes técnicos ao usuário;
- NÃO se preocupe com código;
- Pergunte só o que for necessário;
- Todo critério de aceitação precisa ser testável e verificável;
- Siga rigorosamente o template `./references/TEMPLATE_PRD.md` e NÃO altere sua estrutura;
- Siga rigorosamente o template `./references/TEMPLATE_DECISIONS.md` para registrar decisões de escopo global e NÃO altere sua estrutura;

## Entrada

Um texto de alguns parágrafos descrevendo uma funcionalidade e seus comportamentos.

## Saída esperada

Documento markdown salvo em `.specs/[slug]/prd.md` contendo toda a especificação gerada.

## Processo

1. Identifique a funcionalidade solicitada;
2. Identifique o problema que deve ser resolvido;
3. Leia as decisões de produto de escopo global em `.specs/DECISIONS.md`;
4. Pesquise sobre o domínio do negócio;
5. Identifique personas afetadas;
6. Determine o comportamento esperado;
7. Decomponha comportamentos em histórias de usuários;
8. Decomponha histórias de usuários em critérios de aceitação;
9. Detecte lacunas ou ambiguidades;
10. Produza o documento;
11. Registre decisões de produto de escopo global em `.specs/DECISIONS.md`;
