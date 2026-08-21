import { type Pool } from 'pg'
import { type Transaction } from '@application/interfaces/transaction'
import { type TransactionContext } from '@infra/database/postgres/context'

export class PostgresTransaction implements Transaction {
  private constructor(
    private readonly pool: Pool,
    private readonly context: TransactionContext
  ) {}

  public async run<T>(handler: () => Promise<T>): Promise<T> {
    /* v8 ignore start -- reentrancy is not exercised, since every usecase calls `run` once per request */
    if (this.context.current()) {
      return handler()
    }
    /* v8 ignore stop */

    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const result = await this.context.run(client, handler)

      await client.query('COMMIT')

      return result
    } catch (error) {
      await client.query('ROLLBACK')

      throw error
    } finally {
      client.release()
    }
  }

  public static create(pool: Pool, context: TransactionContext): PostgresTransaction {
    return new PostgresTransaction(pool, context)
  }
}
