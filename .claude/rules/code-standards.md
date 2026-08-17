# Code Standards

## Qualidade

- Nomes de variáveis, funções e classes devem estar em inglês;
- NÃO adicione comentários explicando o que o código faz. O código de ser claro e autoexplicativo;

## Erros

- NÃO crie erros customizados, sempre use o `Problem` para disparar erros conhecidos;
- O uso de `try-catch` só é permitido em classes da camada `infra` para tradução de erros externos para HTTP (ex: Erro `23505` do PostgreSQL para `Problem`);
