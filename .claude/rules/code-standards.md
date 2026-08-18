# Code Standards

## Segurança

- Respeite o período de quarentena definido em `.npmrc`, se a versão atual não atingir o período de quarentena, selecione a versão anterior;
- SEMPRE armazene valores sensíveis em variáveis de ambiente;

## Qualidade

- Nomes de variáveis, funções e classes devem estar em inglês;
- NÃO adicione comentários explicando o que o código faz. O código de ser claro e autoexplicativo;
- Listagens devem ser paginadas;
- SEMPRE importe arquivos usando os apelidos do TypeScript:

❌ Não faça:

```typescript
import { type UserRepository } from '../../../domain/repositories/user'
```

✅ Faça:

```typescript
import { type UserRepository } from '@domain/repositories/user'
```

- Mantenha classes e arquivos abaixo de 100 linhas;
- Limite métodos e funções a 30 linhas;
- Valores mágicos devem ser extraídos em constantes:

❌ Não faça:

```typescript
if (age < 18) {
}
```

✅ Faça:

```typescript
const MIN_AGE = 18

if (age < MIN_AGE) {
}
```

- Limite os parâmetros de funções a 3. Se mais parâmetros forem necessários, receba um objeto;

## Datas

- Metadados de sistema devem estar em UTC;
- Para informações dependentes do horário local do usuário, salve o timezone do usuário em um campo separado;
- Use uma biblioteca confiável para datas ao invés de depender da classe nativa do JavaScript;

## Erros

- NÃO crie erros customizados, sempre use o `Problem` para disparar erros conhecidos;
- O uso de `try-catch` só é permitido em classes da camada `infra` para tradução de erros externos para HTTP (ex: Erro `23505` do PostgreSQL para `Problem`);
