# TASK-06: Mensageria RabbitMQ

Conforme `DEC-18`, o envio de e-mail sai do caminho da requisição: o caso de uso publica numa fila durável e um consumidor entrega a mensagem depois, de modo que uma queda do provedor não derrube o cadastro nem perca o e-mail. Esta tarefa entrega a camada de transporte de mensagens de forma genérica — conexão com reconexão automática, declaração idempotente da topologia, publicador em canal de confirmação e laço de consumo com retentativa por dead lettering — sem conhecer o conteúdo das mensagens de e-mail, que chega em TASK-08.

## Subtarefas

- [x] Criar `src/infra/queue/rabbitmq/connection.ts` abrindo a conexão e os canais a partir da configuração `rabbitmq`, com reconexão automática, e expondo o encerramento ordenado;
- [x] Criar `src/infra/queue/rabbitmq/topology.ts` declarando de forma idempotente, na subida da aplicação, a exchange direta e durável `fincheck.emails`, a fila durável `emails.outgoing` ligada pela chave `send`, a exchange `fincheck.emails.retry`, a fila `emails.retry` com `x-message-ttl` de 30 segundos devolvendo para `fincheck.emails`, e a fila `emails.dead`;
- [x] Extrair para constantes nomeadas os nomes de exchanges, filas e chaves de roteamento, o TTL de 30 segundos e o teto de 5 tentativas;
- [x] Criar `src/infra/queue/rabbitmq/publisher.ts` publicando mensagens persistentes em canal de confirmação, resolvendo a promessa apenas após o `ack` do broker;
- [x] Criar `src/infra/queue/rabbitmq/consumer.ts` com o laço de consumo: validar a mensagem com o schema recebido, delegar ao handler recebido, confirmar em caso de sucesso, encaminhar mensagens inválidas direto para `emails.dead` e, em caso de falha do handler, dar `nack` sem reenfileiramento para que a mensagem caia em `emails.retry`;
- [x] Ler a contagem de tentativas do cabeçalho `x-death` e encaminhar para `emails.dead` ao esgotar o teto de 5 tentativas, mantendo o consumidor vivo em qualquer um dos caminhos de falha;
- [x] Limitar o uso de `try-catch` à tradução de erros externos dentro desta camada `infra`, conforme as regras do projeto;
- [x] Validar a declaração da topologia e um ciclo de publicação e consumo contra o RabbitMQ do `compose.yml`;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- CA-07

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/folder-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-01.md`
- `src/infra/docker/compose.yml`
