---
name: execute-tasks
description: Execute tarefas
---

## Processo

### 1. Selecionar Tarefa

Leia as tarefas no projeto do Linear e selecione a próxima disponível e de maior prioridade de acordo com o caminho crítico. Mova a tarefa selecionada para "In Progress".

Leia o conteúdo da tarefa selecionada, o PRD, a TechSpec e quaisquer arquivos de regras e skills relevantes para o escopo da tarefa.

Considere essa etapa concluída quando a tarefa estiver marcada como "In Progress" no Linear e todo o contexto estiver claro.

### 2. Preparar ambiente

Crie uma worktree para a tarefa junto com uma branch chamada com o identificador da tarefa no Linear e tente executar o servidor e os containers Docker. Se receber um erro de porta em uso para o servidor HTTP, escolhe a próxima porta disponível na faixa `4000 - 4999`. Para containers Docker, escolha a próxima porta de acordo com a faixa do container (por exemplo, `5432-5999` para Postgres).

Execute as migrações quando necessário e faça todo o setup até ter um servidor HTTP responsível.

### 3. Implementação

Execute cada subtarefa na exata ordem declarada. Após a conclusão de uma subtarefa, marque como concluída (`x`) e pule para a próxima.

Considere essa etapa concluída quando todas as subtarefas estiverem concluídas e todos os testes criados.

### 4. Qualidade

Execute verificações de código através dos scripts de formatação e lint. Execute também os testes automatizados pelo menos 3 vezes para garantir que todos estejam passando. Erros em qualquer etapa significa que a tarefa não está concluída, volte e arrume o que for necessário.

### 5. Limpeza

Após tudo estiver passando nos gates de qualidade, pare o servidor HTTP e todos os containers executados para a tarefa. NÃO mate processos do usuário ou de outras worktrees.

Considere essa etapa concluída quando todos os serviços iniciados não estiverem mais em execução e as portas estiverem livres novamente.

### 5. Reportar

Com tudo concluído, faça o push das mudanças para o GitHub.
