# Guia do Fincheck

## 1. O que é

Fincheck é uma API REST de código aberto para gerenciamento de finanças pessoais. As informações podem ser consumidas por aplicações web, mobile ou agentes de IA por meio de MCP.

## 2. Stack

- **Linguagem**: Node.js, TypeScript
- **Banco de Dados**: PostgreSQL
- **Bibliotecas**: Fastify, Zod

## 3. Comandos

```bash
npm run format:check # Checa se os arquivos seguem as regras formatação
npm run format:fix # Corrige erros de formatação em arquivos
npm run lint:check # Checa se os arquivos seguem regras de código
npm run lint:fix # Corrige arquivos que ferem as regras de código
npm run start:dev # Executa o servidor em modo desenvolvimento (hot reload)
npm run test # Executa os testes automatizados sem hot reload
npm run test:watch # Executa os testes automatizados com hot reload
```
