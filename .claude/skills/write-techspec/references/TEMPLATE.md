# Design: [nome da funcionalidade]

## Visão Geral

[faça uma introdução de, no máximo, 2 parágrafos sobre o que será implementado. Não forneça detalhes técnicos já que eles serão detalhados ao longo do documento]

## Variáveis de Ambiente

[Se aplicável, liste quais variáveis de ambiente serão modificadas ou adicionadas ao projeto:

| Nome     | Formato                  | Descrição                       | Sensível   | Status             |
| :------- | :----------------------- | :------------------------------ | :--------- | :----------------- |
| `[nome]` | `[string, number, etc.]` | [explique o que a variável faz] | [✅ ou ❌] | [Novo ou Alterado] |

]

## Arquivos

[liste quais arquivos serão criados ou modificados:

| Caminho                | Camada             | Descrição                                     | Status             |
| :--------------------- | :----------------- | :-------------------------------------------- | :----------------- |
| `[caminho do arquivo]` | `[nome da camada]` | [justifique a criação/modificação do arquivo] | [Novo ou Alterado] |

]

## Contratos

[se aplicável, liste as interfaces de contrato que serão criadas ou modificadas. Liste todas as interfaces de quaisquer camadas:

### `[Nome da interface]` - `[Caminho do arquivo]`

```ts
interface [nome] {
  [métodos]
}
```

]

## Rotas

[se aplicável, liste as rotas que serão criadas ou alteradas e depois destrinche cada uma:

| Método          | Caminho                 | Descrição                                 | Status             |
| :-------------- | :---------------------- | :---------------------------------------- | :----------------- |
| `[Método HTTP]` | `[caminho do endpoint]` | [Breve explicação sobre o que a rota faz] | [Novo ou Alterado] |

---

### `[Método] [Caminho]`

[Breve explicação sobre o que a rota faz]

#### Parâmetros de rota

| Nome     | Tipo                     | Padrão                | Regras                    |
| :------- | :----------------------- | :-------------------- | :------------------------ |
| `[nome]` | `[string, number, etc.]` | `[valor padrão ou -]` | `[validações e formatos]` |

#### Parâmetros de consulta

| Nome     | Padrão                | Regras                    |
| :------- | :-------------------- | :------------------------ |
| `[nome]` | `[valor padrão ou -]` | `[validações e formatos]` |

#### Corpo

```json
{
  "[chave]": "[valor realista]"
}
```

| Nome     | Tipo                     | Padrão                | Regras                    |
| :------- | :----------------------- | :-------------------- | :------------------------ |
| `[nome]` | `[string, number, etc.]` | `[valor padrão ou -]` | `[validações e formatos]` |

#### Respostas

| Status          | Tipo                                | Quando                          |
| :-------------- | :---------------------------------- | :------------------------------ |
| `[código HTTP]` | `[objeto/coleção JSON ou um error]` | `[quando emitir essa resposta]` |

]

## Banco de Dados

[se aplicável, liste tabelas, colunas e índices que serão criados ou alterados:

### `[schema]`.`[tabela]`

#### Colunas

| Nome     | Tipo                 | Obrigatória | Descrição                   | Status             |
| :------- | :------------------- | :---------- | :-------------------------- | :----------------- |
| `[nome]` | `[Tipo do Postgres]` | [✅ ou ❌]  | [Breve explicação a coluna] | [Novo ou Alterado] |

#### Índices

| Nome     | Tipo                    | Descrição                         | Status             |
| :------- | :---------------------- | :-------------------------------- | :----------------- |
| `[nome]` | `[UNIQUE, CHECK, etc.]` | [Breve explicação sobre o índice] | [Novo ou Alterado] |

]

## Dependências

[se aplicável, liste os pacotes que serão adicionados ao projeto e justifique:

| Pacote                   | Produção   | Versão     | Justificativa                     |
| :----------------------- | :--------- | :--------- | :-------------------------------- |
| `[nome canônico no npm]` | [✅ ou ❌] | `[versão]` | [Breve explicação sobre o pacote] |

]

## Decisões

[registre decisões de design da funcionalidade:

| #       | Justificativa                      | Alternativas               |
| :------ | :--------------------------------- | :------------------------- |
| [DEC-*] | [breve explicação sobre a decisão] | [descreva as alternativas] |

]

## Testes Automatizados

[Defina uma estratégia de testes de acordo com a criticidade da funcionalidade. Associe casos de teste a critérios de aceitação:

| #      | Descrição               | Critérios de aceitação | Resultado esperado |
| :----- | :---------------------- | :--------------------- | :----------------- |
| [TU-*] | [nome do caso de teste] | [CA-*]                 | [resultado]        |

]

## Fora de Escopo

[Liste aspectos técnicos que estão explícitamente fora do projeto e não requer atenção]
