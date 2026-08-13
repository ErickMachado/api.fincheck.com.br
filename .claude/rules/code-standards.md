# Padrões de codificação

## Qualidade

- NÃO insira comentários explicativos no código. O código deve ser escrito de forma clara;
- Extraia valores mágicos em constantes;

#### Evite

```ts
const schema = z.object({
  password: z.string().min(8)
})
```

#### Prefira

```ts
const MIN_PASSWORD_LENGTH = 8

const schema = z.object({
  password: z.string().min(MIN_PASSWORD_LENGTH)
})
```

- SEMPRE agrupe variáveis de ambiente por contexto;

## Padrões de Domínio

- SEMPRE use ULID como identificador principal de entidades;

## Gerenciamento de Erros

- SEMPRE use o `Problem` para erros conhecidos independente da camada, NÃO crie erros específicos;
- SEMPRE deixe o manipulador global de erros lidar com exceções. NÃO adicione `try-catch` em casos de uso ou gateways. A única exceção é em repositórios para o mapeamento de erros específicos (como constraint única) em um `Problem`;

## Idioma

- SEMPRE nomeie variáveis, funções e descrição de testes em inglês;
