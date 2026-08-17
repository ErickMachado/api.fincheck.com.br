# API Standards

## Requisições

- Parâmetros de rota, consulta e objetos JSON devem ter suas chaves no formato `snake_case`;
- Rotas devem ser versionadas:

### Não faça:

```text
POST /users
```

### Faça:

```text
POST /v1/users
```

## Respostas

- Todo objeto JSON deve ter suas chaves serializadas em `snake_case`;
- Todo resposta JSON deve ser envelopado em um objeto raiz:

### Não faça:

```json
{
  "id": "01M063ET5G1JAXFBKESMJKJ9G3",
  "email": "tifa.lockhart@gmail.com.com",
  "name": "Tifa Lockhart"
}
```

### Faça:

```json
{
  "user": {
    "id": "01M063ET5G1JAXFBKESMJKJ9G3",
    "email": "tifa.lockhart@gmail.com",
    "name": "Tifa Lockhart"
  }
}
```

- Toda listagem deve ser retornada no formato de coleção:

### Não faça:

```json
[
  {
    "id": "01M063ET5F345KZJWS8ACQVQ3T",
    "email": "cloud.strife@gmail.com",
    "name": "Cloud Strife"
  },
  {
    "id": "01M063ET5G1JAXFBKESMJKJ9G3",
    "email": "tifa.lockhart@gmail.com",
    "name": "Tifa Lockhart"
  }
]
```

### Faça:

```json
{
  "pagination": {
    "cursor": "01M063EBM37WMV8BBX07FGV8PQ"
  },
  "total": 2,
  "users": [
    {
      "id": "01M063ET5F345KZJWS8ACQVQ3T",
      "email": "cloud.strife@gmail.com",
      "name": "Cloud Strife"
    },
    {
      "id": "01M063ET5G1JAXFBKESMJKJ9G3",
      "email": "tifa.lockhart@gmail.com",
      "name": "Tifa Lockhart"
    }
  ]
}
```
