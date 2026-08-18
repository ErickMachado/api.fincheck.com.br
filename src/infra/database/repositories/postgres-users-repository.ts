import { DatabaseError, type QueryResultRow } from 'pg'
import { Problem } from '@common/http/problem'
import { type User } from '@domain/entities/user'
import { type UsersRepository } from '@domain/repositories/users-repository'
import { type DatabaseConnection } from '@infra/database/connection'

const EMAIL_UNIQUE_INDEX = 'users_email_unique_idx'
const UNIQUE_VIOLATION = '23505'

const INSERT_USER = `
  INSERT INTO users (id, first_name, last_name, email, password_hash, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
`

function isEmailAlreadyRegistered(error: unknown): boolean {
  return (
    error instanceof DatabaseError &&
    error.code === UNIQUE_VIOLATION &&
    error.constraint === EMAIL_UNIQUE_INDEX
  )
}

export class PostgresUsersRepository implements UsersRepository {
  public constructor(private readonly connection: DatabaseConnection) {}

  public async create(user: User): Promise<void> {
    try {
      await this.connection.query<QueryResultRow>(INSERT_USER, [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.createdAt.toISO(),
        user.updatedAt.toISO()
      ])
    } catch (error) {
      if (isEmailAlreadyRegistered(error)) {
        throw Problem.conflict({
          title: 'Email already in use',
          detail: 'An account with the given email address already exists'
        })
      }

      throw error
    }
  }
}
