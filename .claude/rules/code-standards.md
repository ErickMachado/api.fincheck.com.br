# Code Standards

## Erros

- NÃO crie erros customizados, sempre use o `Problem` para disparar erros conhecidos;
- O uso de `try-catch` só é permitido em classes da camada `infra` para tradução de erros externos para HTTP (ex: Erro `23505` do PostgreSQL para `Problem`);
