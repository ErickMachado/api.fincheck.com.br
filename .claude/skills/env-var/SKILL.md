---
name: env-var
description: Use essa skill quando precisar adicionar ou modificar variáveis de ambiente ao projeto
---

## Regras

- Toda variável de ambiente fica no arquivo `.env`. NÃO deve ser versionado;
- O arquivo `.env.example` deve ser uma cópia do `.env`, apenas omitindo valores sensíveis. Pode ser versionado;
- O arquivo `.env.test` deve ser uma cópia exata do `.env`, apenas substituindo para valores específicos para os testes. Pode ser versionado;
- Valores adicionados no `.env` devem ser adicionados no schema Zod em `src/libs/core/config.ts`;
- A classe `Configuration` em `src/libs/core/config.ts` deve usar o schema Zod para fazer o parse das variáveis de ambiente. Ela também expões getters que agrupam valores para serem acessados semânticamente. Por exemplo, ao invés de acessar `config.DATABASE_USER`, o código acessa `config.database.user`;
- A classe `Configuration` só deve ser instanciada no arquivo `src/main/main.ts`;
- A injeção das variáveis de ambiente deve acontecer apenas no arquivo `src/main/main.ts`;
