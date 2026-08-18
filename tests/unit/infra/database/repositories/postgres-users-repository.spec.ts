import { DateTime } from 'luxon'
import { DatabaseError } from 'pg'
import { ulid } from 'ulid'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Configuration } from '@common/core/config'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'
import { User } from '@domain/entities/user'
import { DatabaseConnection } from '@infra/database/connection'
import { PostgresUsersRepository } from '@infra/database/repositories/postgres-users-repository'

vi.mock('ulid')

const IDENTIFIER = '01M063ET5G1JAXFBKESMJKJ9G3'
const CREATED_AT = DateTime.utc(2026, 8, 18, 12, 30, 45, 123) as DateTime<true>
const ENVIRONMENT = {
  APP_ENV: 'test',
  APP_HOST: '0.0.0.0',
  APP_PORT: '0',
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/fincheck'
}

function makeDatabaseError(code: string, constraint: string): DatabaseError {
  const error = new DatabaseError('duplicate key value violates unique constraint', 128, 'error')

  error.code = code
  error.constraint = constraint

  return error
}

async function makeSUT() {
  vi.mocked(ulid).mockReturnValue(IDENTIFIER)
  vi.spyOn(DateTime, 'utc').mockReturnValue(CREATED_AT)

  const configuration = await Configuration.from(ENVIRONMENT)
  const connection = DatabaseConnection.create(configuration)
  const querySpy = vi.spyOn(connection, 'query').mockResolvedValue([])
  const sut = new PostgresUsersRepository(connection)
  const user = User.create({
    email: 'Tifa.Lockhart@Gmail.com',
    firstName: 'Tifa',
    lastName: 'Lockhart',
    passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA'
  })

  return { sut, connection, querySpy, user }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('PostgresUsersRepository.create', () => {
  test('Persist every column through a parameterized statement', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()

    // Act
    const output = await sut.create(user)
    const [statement, parameters] = querySpy.mock.calls[0]

    // Assert
    expect(output).toBeUndefined()
    expect(querySpy).toHaveBeenCalledOnce()
    expect(statement).toContain(
      'INSERT INTO users (id, first_name, last_name, email, password_hash, created_at, updated_at)'
    )
    expect(statement).toContain('VALUES ($1, $2, $3, $4, $5, $6, $7)')
    expect(parameters).toEqual([
      IDENTIFIER,
      'Tifa',
      'Lockhart',
      'Tifa.Lockhart@Gmail.com',
      '$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA',
      CREATED_AT.toISO(),
      CREATED_AT.toISO()
    ])
  })

  test('Keep the email spelling out of the statement text', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()

    // Act
    await sut.create(user)
    const [statement] = querySpy.mock.calls[0]

    // Assert
    expect(statement).not.toContain(user.email)
    expect(statement).not.toContain(user.id)
    expect(statement).not.toContain(user.passwordHash)
  })

  test('Translate a unique violation on the email index into a conflict problem', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()
    const databaseError = makeDatabaseError('23505', 'users_email_unique_idx')

    querySpy.mockRejectedValue(databaseError)

    // Act
    const output = await sut.create(user).catch((error: unknown) => error)

    // Assert
    expect(output).toBeInstanceOf(Problem)
    expect((output as Problem).status).toBe(StatusCode.Conflict)
    expect((output as Problem).serialize()).toEqual({
      title: 'Email already in use',
      detail: 'An account with the given email address already exists',
      instance: undefined
    })
  })

  test('Rethrow a unique violation raised by another constraint', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()
    const databaseError = makeDatabaseError('23505', 'users_pkey')

    querySpy.mockRejectedValue(databaseError)

    // Act
    const output = await sut.create(user).catch((error: unknown) => error)

    // Assert
    expect(output).toBe(databaseError)
    expect(output).not.toBeInstanceOf(Problem)
  })

  test('Rethrow any other database failure untouched', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()
    const databaseError = makeDatabaseError('42P01', 'users_email_unique_idx')

    querySpy.mockRejectedValue(databaseError)

    // Act
    const output = await sut.create(user).catch((error: unknown) => error)

    // Assert
    expect(output).toBe(databaseError)
    expect(output).not.toBeInstanceOf(Problem)
  })

  test('Rethrow a failure that is not a database error', async () => {
    // Arrange
    const { sut, querySpy, user } = await makeSUT()
    const failure = new Error('Connection terminated unexpectedly')

    querySpy.mockRejectedValue(failure)

    // Act
    const output = await sut.create(user).catch((error: unknown) => error)

    // Assert
    expect(output).toBe(failure)
    expect(output).not.toBeInstanceOf(Problem)
  })
})
