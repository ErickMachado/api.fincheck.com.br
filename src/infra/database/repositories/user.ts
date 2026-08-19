import { type PoolClient } from 'pg'
import { Problem } from '@common/http/problem'
import { UserActivationToken } from '@domain/entities/user-activation-token'
import { type CreateUserInput, type UserRepository } from '@domain/repositories/user'
import { type Database } from '@infra/database/connection'

type ActivationTokenRow = Readonly<{
  id: string
  user_id_fk: string
  token: string
  expires_at: Date
  used_at: Date | null
  created_at: Date
}>

export class SQLUserRepository implements UserRepository {
  public constructor(private readonly database: Database) {}

  public async create(input: CreateUserInput): Promise<boolean> {
    try {
      return await this.database.transaction((client) => this.insertUser(client, input))
    } catch {
      throw Problem.internal()
    }
  }

  public async findActivationToken(value: string): Promise<UserActivationToken | null> {
    try {
      const result = await this.database.query<ActivationTokenRow>(
        `SELECT id, user_id_fk, token, expires_at, used_at, created_at
         FROM user_activation_tokens
         WHERE token = $1`,
        [value]
      )

      const row = result.rows[0]

      return row ? this.toActivationToken(row) : null
    } catch {
      throw Problem.internal()
    }
  }

  public async activateUser(token: UserActivationToken): Promise<boolean> {
    try {
      return await this.database.transaction((client) => this.consumeToken(client, token))
    } catch {
      throw Problem.internal()
    }
  }

  private async insertUser(client: PoolClient, input: CreateUserInput): Promise<boolean> {
    const { token, user } = input

    const result = await client.query<{ id: string }>(
      `INSERT INTO users (id, first_name, last_name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [user.id, user.firstName, user.lastName, user.email, user.passwordHash, user.createdAt]
    )

    if (result.rowCount === 0) return false

    await client.query(
      `INSERT INTO user_activation_tokens (id, user_id_fk, token, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [token.id, token.userId, token.value, token.expiresAt, user.createdAt]
    )

    return true
  }

  private async consumeToken(client: PoolClient, token: UserActivationToken): Promise<boolean> {
    const now = new Date()

    const result = await client.query<{ user_id_fk: string }>(
      `UPDATE user_activation_tokens
       SET used_at = $1
       WHERE id = $2 AND used_at IS NULL
       RETURNING user_id_fk`,
      [now, token.id]
    )

    const row = result.rows[0]

    if (!row) return false

    await client.query('UPDATE users SET verified_at = $1, updated_at = $1 WHERE id = $2', [
      now,
      row.user_id_fk
    ])

    return true
  }

  private toActivationToken(row: ActivationTokenRow): UserActivationToken {
    return UserActivationToken.restore({
      id: row.id,
      userId: row.user_id_fk,
      value: row.token,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at
    })
  }
}
