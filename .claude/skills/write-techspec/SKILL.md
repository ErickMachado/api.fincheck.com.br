---
name: write-techspec
description: Transforme requisitos de produto em um plano técnico claro e pronto para implementação.
argument-hint: Slug da funcionalidade
---

## Regras

- Faça perguntas e responda o usuário em PT-BR;

## Processo

### 1. Contexto &amp; Pesquisa

#### O que deve ser feito:

Leia o PRD da funcionalidade e identifique histórias de usuários, critérios de aceite e integrações. Verifique se há impedimentos técnicos. Leia o código atual e regras de projeto em `.claude/rules`. Consulte também decisões relevantes em `.specs/LESSONS.md`.

Faça pesquisas na web, compare pontos positivos e negativos de biliotecas, APIs e estratégias. Escolha o melhor caminho de acordo com as necessidades do projeto.

Se integrações com sistemas de terceiros for necessário, leia a documentação e busque informações relevantes sobre a API, formatos de respostas, etc.

#### Objetivo:

Conseguir contexto sobre o que precisa ser feito, pesquisar boas práticas, comparar estratégias e escolher a mais alinhada aos critérios do PRD e estado atual do sistema.

#### Concluído quando:

Todos os pontos do PRD forem explorados, bem como o entendimento de sistemas externos (se aplicável) e estratégias comuns.

### 3. Preparação

#### O que deve ser feito:

Modifique o arquivo `.specs/LESSONS.md` e registre decisões de engenharia que afetam toda a arquitetura.

#### Objetivo:

Manter um registro global de decisões técnicas importantes para que possa servir de consulta no futuro para novas funcionalidades.

#### Concluído quando:

Todas as decisões técnicas relevantes estiverem registradas em `.specs/LESSONS.md`.

### 4. Escrita

#### O que deve ser feito:

Leia o arquivo e `./references/TEMPLATE.md` e organize as informações coletadas no template.

#### Objetivo:

Criar um plano claro e executável sobre as mudanças que serão implementadas. Siga rigorosamente a estrutura e NÃO adicione seções ou informações. Entretanto, você pode esconder seções que não se aplicarem.

#### Concluído quando:

O conteúdo estiver salvo em `.specs/[slug]/design.md`.
