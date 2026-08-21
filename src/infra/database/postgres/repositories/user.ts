import { User } from '@domain/entities/user'
import { type UserRepository } from '@domain/repositories/user'
import { Email } from '@domain/value-objects/email'
import { type TransactionContext } from '@infra/database/postgres/context'

type UserRow = Readonly<{
  id: string
  email: string
  first_name: string
  is_activated: boolean
  last_name: string
  password_hash: string
  created_at: Date
  updated_at: Date
}>

export class PostgresUserRepository implements UserRepository {
  private constructor(private readonly context: TransactionContext) {}

  public async create(user: User): Promise<boolean> {
    const result = await this.context.resolve().query<Pick<UserRow, 'id'>>(
      `INSERT INTO users (id, email, first_name, is_activated, last_name, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        user.id,
        user.email.toString(),
        user.firstName,
        user.isActivated,
        user.lastName,
        user.passwordHash,
        user.createdAt,
        user.updatedAt
      ]
    )

    /* v8 ignore next -- pg always returns a number for `INSERT ... RETURNING`; the fallback only satisfies the nullable type */
    return (result.rowCount ?? 0) > 0
  }

  public async findById(id: string): Promise<User | null> {
    const result = await this.context
      .resolve()
      .query<UserRow>('SELECT * FROM users WHERE id = $1', [id])

    const row = result.rows[0]

    return row ? toUser(row) : null
  }

  public async update(user: User): Promise<void> {
    await this.context
      .resolve()
      .query('UPDATE users SET is_activated = $2, updated_at = $3 WHERE id = $1', [
        user.id,
        user.isActivated,
        user.updatedAt
      ])
  }

  public static create(context: TransactionContext): PostgresUserRepository {
    return new PostgresUserRepository(context)
  }
}

function toUser(row: UserRow): User {
  return User.restore({
    id: row.id,
    email: Email.create(row.email),
    firstName: row.first_name,
    isActivated: row.is_activated,
    lastName: row.last_name,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  })
}
