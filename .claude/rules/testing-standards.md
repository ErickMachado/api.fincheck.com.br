# Testing Standards

## Cobertura

- O projeto deve ter, no mínimo, 90% de cobertura de tests;
- Toda correção de bug ou mudança de código deve ser coberta por testes;

## Estrutura

- SEMPRE use a formato AAA para estruturar testes unitários e de integração:

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

- Para testes unitários, SEMPRE use uma função fábrica no arquivo de teste para montar o SUT e suas dependências

❌ Não faça:

```typescript
test('Return 204 with empty body', () => {
  // Arrange
  const userRepository = new InMemoryUserRepository()
  const hasher = new Base64PasswordHasher(userRepository, hasher)
  const sut = new CreateUserUseCase(us)
  const input = {
    email: 'tifa.lockhart@gmail.com',
    name: 'Tifa Lockhart',
    password: 'm1dg4r 1s 4ws0m3'
  }

  const saveSpy = vi.spyOn(userRepository, 'save')

  // Act
  const output = await sut.execute(input)

  // Assert
  expect(output).toBeUndefined()
  expect(userRepository).toHaveBeenCalledOnce()
})
```

✅ Faça:

```typescript
function makeSUT() {
  const userRepository = new InMemoryUserRepository()
  const hasher = new Base64PasswordHasher(userRepository, hasher)
  const sut = new CreateUserUseCase(us)

  return { sut, userRepository, hasher }
}

test('Return 204 with empty body', () => {
  // Arrange
  const { sut, userRepository } = makeSUT()
  const input = {
    email: 'tifa.lockhart@gmail.com',
    name: 'Tifa Lockhart',
    password: 'm1dg4r 1s 4ws0m3'
  }

  const saveSpy = vi.spyOn(userRepository, 'save')

  // Act
  const output = await sut.execute(input)

  // Assert
  expect(output).toBeUndefined()
  expect(userRepository).toHaveBeenCalledOnce()
})
```

- Os testes devem ser independentes e não pode depender de ordem de execução ou estado criado por outro teste;
- Os testes devem ser consistentes ao serem executados repetidas vezes. Não dependa de horário atual, números aleatórios ou chamadas externas;
- Para testes de integração, sempre use o orquestrador para lidar com a execução/interrupção do servidor, banco de dados, migrações, etc. Esse tipo de comportamento NÃO deve estar dentro de arquivos de teste (`.spec.ts`);
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
