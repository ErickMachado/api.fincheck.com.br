# TASK-14: Portão de cobertura mínima

O projeto exige no mínimo 90% de cobertura, mas o limite não pode ser ligado antes da suíte existir, sob pena de reprovar todas as tarefas intermediárias. Com os dois fluxos e os cenários de resiliência já cobertos, esta última tarefa habilita a medição no `vitest.config.ts`, mede o resultado real e fecha as lacunas que sobrarem com testes blackbox a partir das rotas, sem criar testes unitários nem testar repositórios ou gateways isoladamente.

## Subtarefas

- [x] Habilitar a cobertura em `vitest.config.ts` com o `@vitest/coverage-v8` e o limite mínimo de 90%;
- [x] Restringir a medição ao código de produção em `src`, deixando de fora `tests`, arquivos de configuração e o ponto de entrada;
- [x] Rodar a suíte completa e levantar quais caminhos ficaram descobertos;
- [x] Fechar as lacunas com casos blackbox nas suítes já existentes, sem criar testes unitários e sem testar repositórios ou gateways de forma separada;
- [x] Confirmar que a suíte completa passa de forma consistente em execuções repetidas e que o limite de 90% é atingido;
- [x] Passar pelos portões de qualidade (`npm run test`, `npm run lint:check` e `npm run format:check`).

## Critérios de Aceitação

- `-`

## Skills relevantes

- `.claude/skills/implement-tasks`

## Regras relevantes

- `.claude/rules/bash-standards.md`
- `.claude/rules/code-standards.md`
- `.claude/rules/testing-standards.md`
- `.claude/rules/git-standards.md`

## Testes

- `-`

## Arquivos Relevantes

- `.specs/cadastro-de-usuarios/prd.md`
- `.specs/cadastro-de-usuarios/design.md`
- `.specs/cadastro-de-usuarios/tasks/task-11.md`
- `.specs/cadastro-de-usuarios/tasks/task-12.md`
- `.specs/cadastro-de-usuarios/tasks/task-13.md`
- `vitest.config.ts`
