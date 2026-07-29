---
name: 'github-actions'
description: 'Utilize essa skill quando precisar modificar arquivos de workflow do GitHub Actions'
---

# GitHub Actions

## Objetivo

Construir workflows de GitHub Actions consistentes, velozes e seguindo os padrões da equipe.

## Quando usar

- For solicitado a criação ou alteração de workflows do GitHub Actions;

## Quando NÃO usar

- Precisar modificar arquivos YAML fora do diretório `.github/workflows`;

## Regras

- O arquivo `.github/workflows/ci.yml` só deve ser executado em branches que apontam para a `main`;
- O arquivo `.github/workflows/cd.yml` só deve ser executado quando commits entrarem na branch `main`;
- O ID de cada job deve ser escrito em `snake_case`;
- Todo job e steps devem ter a propriedade `name` com um nome legível para humanos;
- Todo job deve ser executado em um `ubuntu-latest`;
- Comandos de linters, formatadores, etc. devem ser executados através de um script `npm`;
- Não pule linhas entre as declarações de jobs;
- Não modifique arquivos não relacionados à workflows do GitHub Actions;
- Sempre dê preferência a pacotes oficiais. Como o `actions/checkout` e `actions/setup-node`;
- Quando precisar configurar o Node.js, sempre utilize a versão especificada no arquivo `.nvmrc`;
- Sempre utilize o `npm` para instalação de pacotes;
- Sempre habilite o cache de dependências;
- Nunca adicione valores sensíveis em variáveis de ambientes dentro do arquivo de workflow, referencie secrets do GitHub;

## Exemplos

```yml
jobs:
  lint_commit:
    name: 'Lint Commit'
    runs-on: 'ubuntu-latest'
    steps:
      - name: 'Checkout Repository'
        uses: 'actions/checkout@v7'
      - name: 'Setup Node.js'
        uses: 'actions/setup-node@v7'
        with:
          cache: 'npm'
          node-version-file: '.nvmrc'
```
