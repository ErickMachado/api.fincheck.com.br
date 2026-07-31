---
name: 'folder-structure'
description: 'Utilize essa skill quando precisar criar arquivos e diretórios ou organizar código'
---

# Folder Structure

## Objetivo

Organizar pastas e arquivos de acordo com padrão definido pela equipe.

## Quando usar

- Precisar criar um arquivo;
- Precisar criar uma pasta;
- Precisar mudar arquivos e pastas de lugar;

## Quando NÃO usar

- Precisar modificar o conteúdo de arquivos;

## Regras

- Todo código de aplicação deve estar dentro da pasta `src`. A raiz é reservada apenas para arquivos de configuração;
- Todo código de teste, seja unitário ou de integração, deve estar dentro da pasta `tests`;
- A pasta `src` é dividida em 4 camadas:
  - `application`: Guarda casos de uso e interfaces para inversão de dependências;
  - `domain`: Guarda classes de entidades de domínio e suas respectivas interfaces de repositório;
  - `infra`: Guarda implementações concretas de repositórios, conexões com banco de dados, conexão com filas, scripts, etc.;
  - `main`: Guarda o entry point da aplicação, classe de montagem da aplicação e injeção de dependências e rotas da API;
- NÃO mude arquivos e diretórios fora da pasta do projeto;

## Exemplos

### Estrutura do diretório `src`:

```txt
src/
├── application/
│   ├── usecases/
│   │   └── banking/
│   │       └── create-bank-account.ts
│   └── interfaces/
│       └── storage.ts
├── domain/
│   ├── models/
│   │   ├── bank-account.ts
│   │   └── user.ts
│   └── repositories/
│       ├── bank-account.ts
│       └── user.ts
├── infra/
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 0001-create-users-table.js
│   │   └── connection.ts
│   └── docker/
│       ├── compose.dev.yml
│       └── Dockerfile
├── main/
│   ├── routes/
│   │   ├── banking.ts
│   │   └── iam.ts
│   ├── app.ts
│   └── main.ts
```

### Estrutura do diretório `tests`:

```txt
tests/
├── api/
│   ├── create-bank-account.spec.ts
│   ├── create-user.spec.ts
│   └── create-session.spec.ts
```
