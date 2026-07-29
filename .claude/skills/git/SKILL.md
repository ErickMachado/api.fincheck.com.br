---
name: 'git'
description: 'Utilize essa skill quando precisar realizar operações usando o Git'
---

# Git

## Objetivo

Realizar operações utilizando o Git de forma padronizada.

## Quando usar

- Precisar realizar operações de `commit` em arquivos modificados dentro do diretório do projeto;
- Adicionar hooks do Git como `precommit`, `prepush`, etc.;
- Mensagens de commits devem sempre ser em inglês;
- Modificações em fluxos de IA devem sempre ter o escopo `ai` na mensagem;

## Quando NÃO usar

- Precisar modificar configurações do Git;

## Regras

- Nunca utilize a opção `--no-verify` na criação de commits;
- Sempre utilize commits convencionais para a criação de mensagens de commit;
- Sempre gerencie hooks do Git através do `husky`;
- Faça commits atômicos. Mudanças em camadas diferentes devem estar em commits separados com o escopo correto;

## Exemplos

```bash
git commit -m 'feat(iam): add domain model `User`'
```
