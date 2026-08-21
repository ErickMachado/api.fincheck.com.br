import path from 'node:path'
import { runner } from 'node-pg-migrate'
import { Client } from 'pg'
import { Configuration } from '@common/core/config'

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')
const MIGRATIONS_TABLE = 'pgmigrations'

type MigrateOptions = Readonly<{
  count?: number
  direction: 'up' | 'down'
}>

export async function migrate(config: Configuration, options: MigrateOptions): Promise<void> {
  const { database, host, password, port, ssl, user } = config.postgres
  const client = new Client({ database, host, password, port, ssl, user })

  await client.connect()

  try {
    await runner({
      count: options.count,
      dbClient: client,
      dir: MIGRATIONS_DIR,
      direction: options.direction,
      migrationLoaderStrategies: [{ extensions: ['.sql'], loader: 'sql' }],
      migrationsTable: MIGRATIONS_TABLE
    })
  } finally {
    await client.end()
  }
}

/* v8 ignore start -- CLI entry point exercised only via `npm run db:migrate`, not through HTTP routes */
async function main(): Promise<void> {
  const config = await Configuration.from(process.env)

  await migrate(config, { direction: 'up' })
}

if (require.main === module) {
  main()
}
/* v8 ignore stop */
