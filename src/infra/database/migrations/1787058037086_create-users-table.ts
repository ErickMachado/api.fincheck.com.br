import type { MigrationBuilder } from 'node-pg-migrate'

const TABLE = 'users'
const EMAIL_UNIQUE_INDEX = 'users_email_unique_idx'
const EMAIL_UNIQUE_EXPRESSION = 'LOWER(email)'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(
    TABLE,
    {
      id: { type: 'char(26)', notNull: true },
      first_name: { type: 'varchar(50)', notNull: true },
      last_name: { type: 'varchar(50)', notNull: true },
      email: { type: 'varchar(254)', notNull: true },
      password_hash: { type: 'text', notNull: true },
      created_at: { type: 'timestamptz', notNull: true },
      updated_at: { type: 'timestamptz', notNull: true }
    },
    {
      constraints: {
        primaryKey: 'id'
      }
    }
  )

  pgm.createIndex(TABLE, EMAIL_UNIQUE_EXPRESSION, {
    name: EMAIL_UNIQUE_INDEX,
    unique: true
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex(TABLE, EMAIL_UNIQUE_EXPRESSION, { name: EMAIL_UNIQUE_INDEX })
  pgm.dropTable(TABLE)
}
