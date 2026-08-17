---
name: write-prd
description: Transforme pedidos de funcionalidade não estruturados em PRDs claros.
argument-hint: Descreva o que precisa ser feito
---

## Regras

- Faça perguntas e responda o usuário em PT-BR;

## Processo

### 1. Pesquisa & Entrevista

O objetivo dessa etapa é reunir o máximo de informações sobre o que precisa ser feito. Principais usuários e fluxos, métricas, integrações externas, etc. NUNCA peça ao usuário para fornecer detalhes técnicos. Aspectos técnicos serão cobertos no documento de especificações técnica (TechSpec).

Antes de redigir o documento, faça pesquisas na web sobre o domínio do negócio e informações relevantes ao que o usuário quer construir. O que quer que o usuário diga, vá a fundo e veja se isso pode ser traduzido em uma história do usuário ou critério de aceitação. Explore alternativas, faça sugestões e, junto do usuário, escolha a melhor estratégia a ser seguida.

A partir dos critérios de aceitação, formule casos de teste para cobrir tais critérios.

Considere essa etapa concluída quando NÃO houver informações na zona cinzenta e existir um entendimento claro e mútuo sobre o que precisa ser construído e os motivos.

### 2. Escrita

Toda a informação reunida na etapa 1 agora deve ser organizada em um documento estruturado. Leia o arquivo [TEMPLATE.md](./references/TEMPLATE.md) e aplique as informações nesse template. Siga rigorosamente a estrutura e NÃO adicione ou remova seções ou informações.

Considere essa etapa concluída quando o documento estiver salvo em `.specs/features/[slug]/prd.md`.

### 3. Registro de Decisões

Registre no formato de tabela em `.specs/DECISIONS.md` as decisões de negócio. Use o identificador `NEG-*` para cada uma e justifique o motivo pelo qual aquela decisão foi tomada, bem como alternativas consideradas.
