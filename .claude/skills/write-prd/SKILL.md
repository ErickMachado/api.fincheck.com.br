---
name: write-prd
description: Transforme pedidos de funcionalidade não estruturados em PRDs claros.
argument-hint: Descreva o que deve ser feito e os resultados esperados
---

## Regras

- Faça perguntas e responda o usuário em PT-BR;

## Processo

### 1. Pesquisa &amp; Entrevista

#### O que deve ser feito:

Receba o pedido do usuário e faça uma breve pesquisa na web para coletar informações sobre o domínio do negócio, concorrentes e abordagens relevantes ao que deve ser construído. NÃO peça para o usuários fornecer detalhes técnicos e NÃO se preocupe com eles. Entreviste o usuário incessantemente até chegar ao fundo de conceitos e ideias.

#### Objetivo:

Reunir o máximo de contexto e jogar luz em ideias e conceitos que estão na zona cinzenta.

#### Concluído quando:

Houver um entendimento mútuo e escopo fechado sobre o fluxo da funcionalidade, o que precisa ser feito e o que ficará fora.

### 2. Preparação

#### O que deve ser feito:

Modifique (ou crie se não existir) o arquivo `.specs/LESSONS.md`. Registre nele decisões de negócio de escopo global. 

#### Objetivo:

Manter um registro de decisões de negócio de escopo global para servir de consulta em futuras decisões.

#### Concluído quando:

Todas as decisões globais estiverem registradas em `.specs/LESSONS.md`.

### 3. Escrita

#### O que deve ser feito:

Leia o arquivo `./references/TEMPLATE_PRD.md` e aplique as informações nele. Siga rigorosamente a estrutura e NÃO adicione ou remova seções ou informações. Entretanto, você pode esconder seções que não se aplicarem ao projeto.

#### Objetivo:

Tendo claro o que precisa ser construído, é hora de consolidar todo o contexto em um PRD. Documento que servirá de base para todas as futuras fases do projeto.

#### Concluído quando:

O documento estiver salvo em `.specs/[slug]/prd.md`.
