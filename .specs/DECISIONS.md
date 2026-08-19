# Decisões

## Negócio

| #      | Contexto                                                                                                                                                                                                        | Origem                 |
| :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| BUS-1  | O endereço de e-mail é o identificador único de uma pessoa no produto. Duas contas nunca podem existir para o mesmo endereço                                                                                    | `cadastro-de-usuarios` |
| BUS-2  | A comparação de e-mails é insensível a maiúsculas e minúsculas, e o sufixo após `+` no nome do usuário é considerado apelido e desconsiderado, para qualquer domínio. Pontos no nome do usuário são preservados | `cadastro-de-usuarios` |
| BUS-3  | Apenas o e-mail normalizado (minúsculo e sem apelido) é registrado na conta; a forma original digitada não é preservada                                                                                         | `cadastro-de-usuarios` |
| BUS-4  | A API nunca revela se um endereço de e-mail possui conta. Cadastro com e-mail já existente responde exatamente como um cadastro novo, sem criar nada e sem enviar mensagem alguma                               | `cadastro-de-usuarios` |
| BUS-5  | Senhas exigem apenas tamanho entre 8 e 64 caracteres, sem regras de composição ou lista de senhas proibidas                                                                                                     | `cadastro-de-usuarios` |
| BUS-6  | Nome da pessoa é registrado em dois campos separados: primeiro nome e último nome, ambos entre 2 e 100 caracteres                                                                                               | `cadastro-de-usuarios` |
| BUS-7  | Cadastro, verificação de e-mail e autenticação são fluxos independentes. Concluir um cadastro ou uma verificação não inicia sessão nem devolve credenciais                                                      | `cadastro-de-usuarios` |
| BUS-8  | Espaços em branco no início e no fim são removidos de todos os campos de entrada antes da validação, exceto senha. A senha é preservada exatamente como enviada, e seus espaços contam para o limite de tamanho | `cadastro-de-usuarios` |
| BUS-9  | Toda conta nasce com o e-mail não verificado e assim permanece até que o código seja confirmado. A verificação não é pré-requisito para a conta existir                                                         | `cadastro-de-usuarios` |
| BUS-10 | A verificação de e-mail usa um token de uso único, exclusivo no produto e não dedutível, com validade de 15 minutos a partir da criação da conta e comparado exatamente como gerado                             | `cadastro-de-usuarios` |
| BUS-11 | O token viaja em um link de ativação enviado por e-mail, no formato `https://app.fincheck.com.br/users/verify?token=<token>`, e a verificação exige apenas o token, sem e-mail nem credencial                   | `cadastro-de-usuarios` |
| BUS-12 | Token desconhecido, expirado e já utilizado produzem a mesma recusa, sem distinção observável                                                                                                                   | `cadastro-de-usuarios` |

## Engenharia

| #     | Contexto                                                                                     | Origem                 |
| :---- | :------------------------------------------------------------------------------------------- | :--------------------- |
| ENG-1 | O Resend é o provedor de e-mail transacional do produto e todo envio de e-mail passa por ele | `cadastro-de-usuarios` |
