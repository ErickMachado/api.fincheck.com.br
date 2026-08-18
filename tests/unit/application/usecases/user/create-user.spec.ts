import { DateTime } from 'luxon'
import { ulid } from 'ulid'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CreateUserUseCase } from '@application/usecases/user/create-user'
import { User } from '@domain/entities/user'
import { FakePasswordHasher } from '../../../../mocks/fake-password-hasher'
import { InMemoryUsersRepository } from '../../../../mocks/in-memory-users-repository'

vi.mock('ulid')

const IDENTIFIER = '01M063ET5G1JAXFBKESMJKJ9G3'
const CREATED_AT = DateTime.utc(2026, 8, 18, 12, 30, 45, 123) as DateTime<true>
const PLAIN_TEXT_PASSWORD = 'cavalo bateria grampo correto'

function makeSUT() {
  const ulidSpy = vi.mocked(ulid).mockReturnValue(IDENTIFIER)
  const utcSpy = vi.spyOn(DateTime, 'utc').mockReturnValue(CREATED_AT)
  const passwordHasher = new FakePasswordHasher()
  const usersRepository = new InMemoryUsersRepository()
  const sut = new CreateUserUseCase(usersRepository, passwordHasher)
  const input = {
    email: 'Tifa.Lockhart@Gmail.com',
    firstName: 'Tifa',
    lastName: 'Lockhart',
    password: PLAIN_TEXT_PASSWORD
  }

  return { sut, input, passwordHasher, ulidSpy, usersRepository, utcSpy }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('CreateUser.execute', () => {
  test('Delegates the hashing and assembles the same user on every run', async () => {
    // Arrange
    const { sut, input, passwordHasher, usersRepository } = makeSUT()
    const expectedHash = await passwordHasher.hash(PLAIN_TEXT_PASSWORD)
    const hashSpy = vi.spyOn(passwordHasher, 'hash')

    // Act
    await sut.execute(input)
    await sut.execute(input)
    const [firstUser, secondUser] = usersRepository.users

    // Assert
    expect(hashSpy).toHaveBeenCalledTimes(2)
    expect(hashSpy).toHaveBeenCalledWith(PLAIN_TEXT_PASSWORD)
    expect(firstUser).toEqual(secondUser)
    expect(firstUser.id).toBe(IDENTIFIER)
    expect(firstUser.createdAt).toBe(CREATED_AT)
    expect(firstUser.updatedAt).toBe(firstUser.createdAt)
    expect(firstUser.firstName).toBe('Tifa')
    expect(firstUser.lastName).toBe('Lockhart')
    expect(firstUser.email).toBe('Tifa.Lockhart@Gmail.com')
    expect(firstUser.passwordHash).toBe(expectedHash)
  })

  test('Hands a single user to the repository without the plain text password', async () => {
    // Arrange
    const { sut, input, usersRepository } = makeSUT()
    const createSpy = vi.spyOn(usersRepository, 'create')

    // Act
    const output = await sut.execute(input)
    const [user] = usersRepository.users

    // Assert
    expect(output).toBeUndefined()
    expect(createSpy).toHaveBeenCalledOnce()
    expect(usersRepository.users).toHaveLength(1)
    expect(user).toBeInstanceOf(User)
    expect(user.passwordHash).not.toBe(PLAIN_TEXT_PASSWORD)
    expect(user.passwordHash).not.toContain(PLAIN_TEXT_PASSWORD)
    expect(JSON.stringify(user)).not.toContain(PLAIN_TEXT_PASSWORD)
  })
})
