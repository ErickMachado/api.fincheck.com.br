# Database Standards

## Tabelas

- Nomes devem estar em `snake_case`;

## Colunas

- Nomes devem estar em `snake_case`;
- Nomes de colunas que armazenam chaves estrangeiras devem ter o sufixo `_fk`;

## Operações

- Use transações explícitas ao invés de CTE para garantir atomicidade;

## Migrações

- Deixe que a ferramenta de migração gere o prefixo de timestamp dos arquivos;
- Migrações devem ser arquivos `.sql`;

&nbsp;
