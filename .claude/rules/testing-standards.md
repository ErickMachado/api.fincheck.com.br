# Testing Standards

## Cobertura

- O projeto deve ter, no mínimo, 90% de cobertura de tests;
- A cobertura deve ser feita majoritariamente por testes de integração blackbox a partir de um ponto de entrada. NÃO crie testes unitários e NÃO teste repositórios ou gateways de forma separada;

## Estrutura

- SEMPRE use a formato AAA para estruturar casos de teste:

❌ Não faça:

```typescript
test('Return 204 with empty body', () => {
  const body = {
    email: 'tifa.lockhart@gmail.com',
    name: 'Tifa Lockhart',
    password: 'm1dg4r 1s 4ws0m3'
  }
  const response = await fetch(`${app.address}/v1/users`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const text = await response.text()
  expect(response.status).toBe(204)
  expect(text).toEqual('')
})
```

✅ Faça:

```typescript
test('Return 204 with empty body', () => {
  // Arrange
  const body = {
    email: 'tifa.lockhart@gmail.com',
    name: 'Tifa Lockhart',
    password: 'm1dg4r 1s 4ws0m3'
  }

  // Act
  const response = await fetch(`${app.address}/v1/users`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const text = await response.text()

  // Assert
  expect(response.status).toBe(204)
  expect(text).toEqual('')
})
```

- Os testes devem ser independentes e não pode depender de ordem de execução ou estado criado por outro teste;
- Os testes devem ser consistentes ao serem executados repetidas vezes. Não dependa de horário atual, números aleatórios ou chamadas externas;
- Para testes de integração, sempre use o orquestrador para lidar com a execução/interrupção do servidor, banco de dados, migrações, etc. Esse tipo de comportamento NÃO deve estar dentro de arquivos de teste (`.spec.ts`);
- Crie métodos utilitários no orquestrador para tarefas como sign up, sign in, etc.
- Para testes de integração, SEMPRE declare na descrição da suíte qual rota está sendo testada:

❌ Não faça:

```typescript
describe('User creation flow', () => {})
```

✅ Faça:

```typescript
describe('POST /v1/users', () => {})
```

- SEMPRE faça um stub para chamadas a serviços externos (ex: API do GitHub);
- NÃO use valores fixos para dados de entrada, use um pacote que gera dados de forma aleatória;
