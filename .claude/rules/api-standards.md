# API Standards

## Requisições

- Parâmetros de rota, consulta e objetos JSON devem ter suas chaves no formato `snake_case`;
- Rotas devem ser versionadas:

### ❌ Não faça:

```text
POST /users
```

### ✅ Faça:

```text
POST /v1/users
```

- Siga o princípio de interface uniforme para nomear rotas;

## Respostas

- Todo objeto JSON deve ter suas chaves serializadas em `snake_case`;
- Todo resposta JSON deve ser envelopado em um objeto raiz:

### ❌ Não faça:

```json
{
  "id": "01M063ET5G1JAXFBKESMJKJ9G3",
  "email": "mateus-rodrigues84@ggm.com.br",
  "name": "Mateus Rodrigues"
}
```

### ✅ Faça:

```json
{
  "user": {
    "id": "01M063ET5G1JAXFBKESMJKJ9G3",
    "email": "mateus-rodrigues84@ggm.com.br",
    "name": "Mateus Rodrigues"
  }
}
```

- Toda listagem deve ser retornada no formato de coleção:

### ❌ Não faça:

```json
[
  {
    "id": "01M063ET5F345KZJWS8ACQVQ3T",
    "email": "julia_farias@agltda.com.br",
    "name": "Julia Farias"
  },
  {
    "id": "01M063ET5G1JAXFBKESMJKJ9G3",
    "email": "mateus-rodrigues84@ggm.com.br",
    "name": "Mateus Rodrigues"
  }
]
```

### ✅ Faça:

```json
{
  "pagination": {
    "cursor": "01M063ET5G1JAXFBKESMJKJ9G3"
  },
  "total": 2,
  "users": [
    {
      "id": "01M063ET5F345KZJWS8ACQVQ3T",
      "email": "julia_farias@agltda.com.br",
      "name": "Julia Farias"
    },
    {
      "id": "01M063ET5G1JAXFBKESMJKJ9G3",
      "email": "mateus-rodrigues84@ggm.com.br",
      "name": "Mateus Rodrigues"
    }
  ]
}
```
