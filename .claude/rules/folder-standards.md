# Folder Standards

## Visão Geral

### `src`

| Camada        | Caminho           | Descrição                                                                                            | Pode importar de                            |
| :------------ | :---------------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| `application` | `src/application` | Implementações de controllers, casos de uso e declaração de interfaces para inversão de dependências | `common` e `domain`                         |
| `common`      | `src/common`      | Implementações comuns que podem ser usadas por qualquer camada                                       | -                                           |
| `domain`      | `src/domain`      | Implementações de entidades de domínio e declaração de interfaces para acesso aos dados              | `common`                                    |
| `infra`       | `src/infra`       | Implementa conexão com banco de dados, repositórios, gateways, etc.                                  | `application`, `common` e `domain`          |
| `main`        | `src/main`        | Declarações de rotas e ponto de entrada do servidor HTTP                                             | `application`, `common`, `domain` e `infra` |

---

#### `application`

| Diretório     | Caminho                       | Descrição                                                                            |
| :------------ | :---------------------------- | :----------------------------------------------------------------------------------- |
| `controllers` | `src/application/controllers` | Valida as entradas da rota, chama casos de uso e formata respostas                   |
| `interfaces`  | `src/application/interfaces`  | Declara interfaces descrevendo como casos de uso interagem com dependências externas |
| `usecases`    | `src/application/usecases`    | Implementações de casos de uso                                                       |

---

#### `domain`

| Diretório      | Caminho                   | Descrição                                      |
| :------------- | :------------------------ | :--------------------------------------------- |
| `entities`     | `src/domain/entities`     | Implementações das entidades de domínio        |
| `repositories` | `src/domain/repositories` | Declarações de interfaces para acesso ao dados |

---

#### `infra`

| Diretório  | Caminho              | Descrição                                                                   |
| :--------- | :------------------- | :-------------------------------------------------------------------------- |
| `database` | `src/infra/database` | Implementações de conexão com o banco, repositórios e arquivos de migrações |
| `docker`   | `src/infra/docker`   | Arquivos de compose e `Dockerfile`                                          |

---

#### `main`

| Arquivo     | Caminho              | Responsabilidades                                                                                |
| :---------- | :------------------- | :----------------------------------------------------------------------------------------------- |
| `app.ts`    | `src/main/app.ts`    | Inicializadora do servidor HTTP, conexão com banco de dados e instanciação de casos de uso, etc. |
| `main.ts`   | `src/main/main.ts`   | Parse de variáveis de ambiente, instanciação e inicialização do app                              |
| `router.ts` | `src/main/router.ts` | Declarações das rotas HTTP                                                                       |

### `tests`

| Camada        | Caminho             | Descrição                                     |
| :------------ | :------------------ | :-------------------------------------------- |
| `integration` | `tests/integration` | Testes de API                                 |
| `mocks`       | `tests/mocks`       | Dublês de teste e stubs                       |
| `setup`       | `tests/setup`       | Classes utilitárias para testes de integração |
| `unit`        | `tests/unit`        | Testes de unidade                             |

---

#### `setup`

| Arquivo           | Caminho                    | Responsabilidades                                                                                                |
| :---------------- | :------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `orchestrator.ts` | `src/main/orchestrator.ts` | Expõe métodos para iniciar ou para o servidor. Sobe serviços externos usando `testcontainer` e executa migrações |
