# TASK-8: Cadastro: caso de uso e controller de `POST /v1/auth/users`

Esta é a tarefa que reúne as peças anteriores no fluxo de cadastro. O controller valida o corpo com Zod, aparando os espaços das bordas de todos os campos exceto a senha e apontando de uma só vez todos os campos fora do formato aceito. O caso de uso normaliza o endereço com `Email`, deriva o hash da senha sempre — inclusive quando o e-mail já pertence a alguém, para que o caminho existente não seja mensuravelmente mais rápido que o novo — tenta criar a conta com o token e, somente quando a criação de fato aconteceu, monta o link de ativação e dispara o e-mail. Criação e recusa por e-mail já existente produzem exatamente a mesma resposta `204` sem corpo.

## Subtarefas

- [ ] Criar `src/application/controllers/auth/create-user.ts` com o esquema Zod do corpo em `snake_case`: `email`, `first_name`, `last_name` e `password`
- [ ] Aplicar no esquema o `trim` de `email`, `first_name` e `last_name` antes das validações de tamanho, e deixar `password` intocada, de modo que seus espaços contem para o limite
- [ ] Declarar as regras de cada campo: `first_name` e `last_name` entre 2 e 100 caracteres após a aparagem, `password` entre 8 e 64 caracteres sem exigência de composição e `email` em formato válido com no máximo 254 caracteres, extraindo os limites em constantes
- [ ] Fazer o controller chamar `CreateUserUseCase` com os dados validados e devolver `HTTPResponse` com `StatusCode.NoContent` e sem corpo
- [ ] Criar `src/application/usecases/auth/create-user.ts` recebendo pelo construtor o `UserRepository`, o `Hasher`, o `Mailer` e a URL base da aplicação cliente, agrupados em um objeto para respeitar o limite de parâmetros
- [ ] Normalizar o endereço com `Email.create` e derivar o hash da senha antes de qualquer consulta ou escrita, sem condicionar a derivação à existência da conta
- [ ] Construir `User` e `UserActivationToken` e chamar `UserRepository.create`, encerrando o caso de uso sem efeito algum quando ele devolver `false`
- [ ] Quando a conta foi criada, montar a URL `<APP_WEB_URL>/users/verify?token=<token>` e chamar `Mailer.sendAccountActivation` com o endereço normalizado e o primeiro nome, aguardando a entrega
- [ ] Executar `npm run format:check` e `npm run lint:check` e corrigir o que apontarem

## Critérios de Aceitação

- CA-1
- CA-2
- CA-3
- CA-4
- CA-5
- CA-6
- CA-7
- CA-8
- CA-9
- CA-10
- CA-11
- CA-12
- CA-13
- CA-14
- CA-24
- CA-25
- CA-26
- CA-27
- CA-28
- CA-29
- CA-30
- CA-32
- CA-34

## Skills relevantes

- `.claude/skills/execute-tasks`

## Regras relevantes

- `.claude/rules/api-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`

## Testes

Não se aplica: o comportamento entregue é exercitado pela suíte de TASK-12.

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/DECISIONS.md`
- `src/application/controllers/auth/create-user.ts`
- `src/application/usecases/auth/create-user.ts`
- `src/application/interfaces/hasher.ts`
- `src/application/interfaces/mailer.ts`
- `src/domain/repositories/user.ts`
