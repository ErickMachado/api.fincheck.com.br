# Code Standards

## Qualidade

- Nomes de variáveis, funções e classes devem estar em inglês;
- NÃO adicione comentários explicando o que o código faz. O código de ser claro e autoexplicativo;
- Listagens devem ser paginadas;

## Datas

- Metadados de sistema devem estar em UTC;
- Para informações dependentes do horário local do usuário, salve o timezone do usuário em um campo separado;
- Use uma biblioteca confiável para datas ao invés de depender da classe nativa do JavaScript;

## Erros

- NÃO crie erros customizados, sempre use o `Problem` para disparar erros conhecidos;
- O uso de `try-catch` só é permitido em classes da camada `infra` para tradução de erros externos para HTTP (ex: Erro `23505` do PostgreSQL para `Problem`);
