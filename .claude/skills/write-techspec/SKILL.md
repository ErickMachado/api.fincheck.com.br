---
name: write-techspec
description: Transforme requisitos de produto em um plano técnico claro e pronto para implementação.
argument-hint: Slug da funcionalidade
---

## Regras

- Faça perguntas e responda o usuário em PT-BR;

## Processo

### 1. Contexto & Pesquisa

O objetivo dessa etapa é reunir o máximo de informações sobre o que precisa ser feito. Leia o PRD fornecido, identifique as histórias de usuários e critérios de aceitação e verifique se há impedimentos técnicos para o que precisa ser feito. Leia também as regras do projeto em `.claude/rules/*.md` e o código afim de determinar o estado atual do projeto.

Antes de redigir o documento, faça pesquisas na web sobre o domínio do negócio e boas práticas relevantes. Explore alternativas e compare os pontos positivos e negativos de estratégias, ferramentas e bibliotecas para escolher o que melhor se encaixar ao momento do projeto e a funcionalidade sem depender do usuário. Caso a funcionalidade dependa de integrações com sistemas externos, leia a documentação da ferramenta ou API.

Considere essa etapa concluída quando NÃO houver informações na zona cinzenta e existir um entendimento claro e mútuo sobre o que precisa ser construído e os motivos.

### 2. Escrita

Toda a informação reunida na etapa 1 agora deve ser organizada em um documento estruturado. Leia o arquivo [TEMPLATE.md](./references/TEMPLATE.md) e aplique as informações nesse template. Siga rigorosamente a estrutura e NÃO adicione seções ou informações, porém, Você pode esconder seções que não se aplicarem ao caso da funcionalidade.

Considere essa etapa concluída quando o documento estiver salvo em `.specs/features/[nome]/spec.md`.

### 3. Registro de Decisões

Registre no formato de tabela em `.specs/DECISIONS.md` as decisões técnicas que afetam outras partes do projeto. Use o identificador `ENG-*` para cada uma e justifique o motivo pelo qual aquela decisão foi tomada, bem como alternativas consideradas.
