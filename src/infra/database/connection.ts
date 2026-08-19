import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg'

export type PostgresConfig = Readonly<{
  database: string
  host: string
  password: string
  port: number
  ssl: boolean
  user: string
}>

export class Database {
  private constructor(private readonly pool: Pool) {}

  public static async connect(config: PostgresConfig): Promise<Database> {
    const pool = new Pool({
      database: config.database,
      host: config.host,
      password: config.password,
      port: config.port,
      ssl: config.ssl,
      user: config.user
    })

    await pool.query('SELECT 1')

    return new Database(pool)
  }

  public async query<T extends QueryResultRow>(
    statement: string,
    values?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(statement, values)
  }

  public async transaction<T>(handler: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')
      const result = await handler(client)
      await client.query('COMMIT')

      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public async disconnect(): Promise<void> {
    await this.pool.end()
  }
}
