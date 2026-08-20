import { Pool } from 'pg'
import { type Configuration } from '@common/core/config'

export class PostgresConnection {
  private constructor(public readonly pool: Pool) {}

  public async close(): Promise<void> {
    await this.pool.end()
  }

  public static create(config: Configuration): PostgresConnection {
    const { database, host, password, port, ssl, user } = config.postgres

    return new PostgresConnection(new Pool({ database, host, password, port, ssl, user }))
  }
}
