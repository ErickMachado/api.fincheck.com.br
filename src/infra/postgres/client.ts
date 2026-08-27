import { AsyncLocalStorage } from 'node:async_hooks'
import { Pool, PoolClient } from 'pg'
import { type Task, type Transaction } from '@application/ports/database'
import { Configuration } from '@common/core/config'

export class PostgresClient implements Transaction {
  private storage = new AsyncLocalStorage<PoolClient>()

  private constructor(private readonly pool: Pool) {}

  public get connection(): PoolClient | Pool {
    return this.storage.getStore() ?? this.pool
  }

  public async close() {
    await this.pool.end()
  }

  public async begin(task: Task) {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')
      await this.storage.run(client, task)
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public static async connect(config: Configuration): Promise<PostgresClient> {
    const pool = new Pool({
      database: config.postgres.database,
      host: config.postgres.host,
      password: config.postgres.password,
      port: config.postgres.port,
      ssl: config.postgres.ssl,
      user: config.postgres.user
    })

    await pool.query('SELECT now()')

    return new PostgresClient(pool)
  }
}
