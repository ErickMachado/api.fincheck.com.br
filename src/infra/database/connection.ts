import { DateTime } from 'luxon'
import { Pool, type QueryResultRow, types } from 'pg'
import { type Configuration } from '@common/core/config'

const TIMESTAMPTZ_OID = 1184

types.setTypeParser(
  TIMESTAMPTZ_OID,
  (value: string): DateTime => DateTime.fromSQL(value, { setZone: true }).toUTC()
)

export class DatabaseConnection {
  private constructor(private readonly pool: Pool) {}

  public async query<T extends QueryResultRow>(
    statement: string,
    parameters: readonly unknown[] = []
  ): Promise<T[]> {
    const result = await this.pool.query<T>(statement, [...parameters])

    return result.rows
  }

  public async disconnect(): Promise<void> {
    await this.pool.end()
  }

  public static create(config: Configuration): DatabaseConnection {
    return new DatabaseConnection(new Pool({ connectionString: config.database.url }))
  }
}
