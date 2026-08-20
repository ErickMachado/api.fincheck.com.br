import { Activation } from '@domain/entities/activation'
import { type ActivationRepository } from '@domain/repositories/activation'
import { type TransactionContext } from '@infra/database/postgres/context'

type ActivationRow = Readonly<{
  id: string
  user_fk: string
  consumed_at: Date | null
  expires_at: Date
  token_hash: string
  created_at: Date
}>

export class PostgresActivationRepository implements ActivationRepository {
  private constructor(private readonly context: TransactionContext) {}

  public async create(activation: Activation): Promise<void> {
    await this.context.resolve().query(
      `INSERT INTO user_activation_tokens (id, user_fk, consumed_at, expires_at, token_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        activation.id,
        activation.userId,
        activation.consumedAt,
        activation.expiresAt,
        activation.tokenHash,
        activation.createdAt
      ]
    )
  }

  public async findByTokenHash(tokenHash: string): Promise<Activation | null> {
    const result = await this.context
      .resolve()
      .query<ActivationRow>(
        'SELECT * FROM user_activation_tokens WHERE token_hash = $1 FOR UPDATE',
        [tokenHash]
      )

    const row = result.rows[0]

    return row ? toActivation(row) : null
  }

  public async update(activation: Activation): Promise<void> {
    await this.context
      .resolve()
      .query('UPDATE user_activation_tokens SET consumed_at = $2 WHERE id = $1', [
        activation.id,
        activation.consumedAt
      ])
  }

  public static create(context: TransactionContext): PostgresActivationRepository {
    return new PostgresActivationRepository(context)
  }
}

function toActivation(row: ActivationRow): Activation {
  return Activation.restore({
    id: row.id,
    userId: row.user_fk,
    consumedAt: row.consumed_at,
    expiresAt: row.expires_at,
    tokenHash: row.token_hash,
    createdAt: row.created_at
  })
}
