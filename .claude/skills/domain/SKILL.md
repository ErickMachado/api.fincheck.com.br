---
name: 'domain'
description: 'Use essa skill quando precisar criar ou modificar modelos de domínio ou suas interfaces de repositório'
---

# Domain

## Objetivo

Criar modelos de domínios de forma consistente.

## Quando usar

- Precisar criar ou modificar uma entidade de domínio;
- Precisar criar ou modificar uma interface de repositório;

## Quando NÃO usar

- Precisar criar ou modificar implementações concretas de repositórios;
- Precisar criar ou modificar interfaces em outras camadas da aplicação;

## Regras

- Todo modelo de domínio deve ser representado como uma classe;
- Todo modelo de domínio deve ter um método estático chamado `create` para a instanciação do modelo;
- O método construtor deve ser público;
- O método construtor deve receber um objeto como parâmetro;
- Modelos de domínio NÃO devem se comunicar com banco de dados, requisições HTTP, sistema de arquivos ou qualquer tipo de comunicação externa;
- Toda entidade de domínio deve ter o ID no formato ULID;
- Sempre utilize a biblioteca `luxon` para lidar com datas;
- Sempre converta datas para UTC;

## Exemplos

### Estrutura de um modelo

```ts
type Properties = Readonly<{
  id: string
  name: string
  type: TransactionType
  createdAt: DateTime
}>

type CreateTransaction = Readonly<{
  name: string
  type: TransactionType
}>

enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME'
}

class Transaction {
  public readonly id: string
  public name: string
  public type: TransactionType
  public readonly createdAt: DateTime

  public constructor(properties: Properties) {
    this.id = properties.id
    this.name = properties.name
    this.type = properties.type
    this.createdAt = properties.createdAt.toUTC()
  }

  public get isIncome(): boolean {
    return this.type === TransactionType.INCOME
  }

  public static create(data: CreateTransaction): Transaction {
    return new Transaction({
      id: ulid(),
      name: data.name,
      type: data.type,
      createdAt: DateTime.utc()
    })
  }
}
```

### Estrutura de uma interface de repositório

```ts
type Filters = Readonly<{
  ids: string[]
  name: string
}>

interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>
  findAll(filters: Filters): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
}
```
