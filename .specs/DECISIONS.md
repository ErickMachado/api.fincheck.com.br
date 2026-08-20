# Decisões

## Negócio

| #      | Contexto                                                                                                                                                                                                                               | Origem                 |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| BUS-01 | O e-mail é o identificador único de um usuário no Fincheck. Não existe nome de usuário e duas contas nunca podem compartilhar o mesmo endereço.                                                                                        | `cadastro-de-usuarios` |
| BUS-02 | E-mails são tratados de forma insensível a maiúsculas e minúsculas, sendo normalizados para minúsculas antes de serem armazenados ou comparados. Apelidos (subendereçamento com `+`) são preservados e valem como endereços distintos. | `cadastro-de-usuarios` |
| BUS-03 | A API nunca revela se um endereço de e-mail já possui conta. Operações que dependem da existência de um e-mail respondem de forma indistinguível entre o caso existente e o inexistente.                                               | `cadastro-de-usuarios` |
| BUS-04 | Contas são criadas em estado não ativado e só passam a ativadas após a confirmação de propriedade do e-mail informado.                                                                                                                 | `cadastro-de-usuarios` |
| BUS-05 | Tokens enviados por e-mail são de uso único e expiram em 15 minutos. Token inexistente, expirado ou já consumido produzem a mesma resposta de erro genérica.                                                                           | `cadastro-de-usuarios` |
| BUS-06 | Senhas têm no mínimo 8 e no máximo 64 caracteres, sem exigência de complexidade.                                                                                                                                                       | `cadastro-de-usuarios` |
| BUS-07 | Primeiro e último nome são campos separados e obrigatórios, com 1 a 100 caracteres cada e sem restrição de caracteres permitidos.                                                                                                      | `cadastro-de-usuarios` |
| BUS-08 | Todo e-mail transacional do Fincheck é remetido por `noreply@fincheck.com.br`, endereço que não monitora nem recebe respostas.                                                                                                         | `cadastro-de-usuarios` |

## Engenharia

| #      | Contexto                                                                                                             | Origem                 |
| :----- | :------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| ENG-01 | O Resend é o provedor de envio de e-mails transacionais do Fincheck. Todo e-mail enviado pelo produto passa por ele. | `cadastro-de-usuarios` |
