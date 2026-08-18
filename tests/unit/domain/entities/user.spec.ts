import { DateTime } from 'luxon'
import { ulid } from 'ulid'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { User } from '@domain/entities/user'

vi.mock('ulid')

const IDENTIFIER = '01M063ET5G1JAXFBKESMJKJ9G3'
const CREATED_AT = DateTime.utc(2026, 8, 18, 12, 30, 45, 123) as DateTime<true>
const PASSWORD_HASH = '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$c29tZWhhc2g'
const PLAIN_TEXT_PASSWORD = 'cavalo bateria grampo correto'

function makeSUT() {
  const ulidSpy = vi.mocked(ulid).mockReturnValue(IDENTIFIER)
  const utcSpy = vi.spyOn(DateTime, 'utc').mockReturnValue(CREATED_AT)
  const localSpy = vi.spyOn(DateTime, 'local')
  const nowSpy = vi.spyOn(DateTime, 'now')
  const attributes = {
    email: 'Tifa.Lockhart@Gmail.com',
    firstName: 'Tifa',
    lastName: 'Lockhart',
    passwordHash: PASSWORD_HASH
  }

  return { sut: User, attributes, localSpy, nowSpy, ulidSpy, utcSpy }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('User.create', () => {
  test('Generates the identifier and the creation date, and keeps the password hash', () => {
    // Arrange
    const { sut, attributes, ulidSpy } = makeSUT()

    // Act
    const user = sut.create(attributes)

    // Assert
    expect(ulidSpy).toHaveBeenCalledOnce()
    expect(user.id).toBe(IDENTIFIER)
    expect(user.createdAt).toBe(CREATED_AT)
    expect(user.updatedAt).toBe(user.createdAt)
    expect(user.firstName).toBe('Tifa')
    expect(user.lastName).toBe('Lockhart')
    expect(user.email).toBe('Tifa.Lockhart@Gmail.com')
    expect(user.passwordHash).toBe(PASSWORD_HASH)
    expect(user).not.toHaveProperty('password')
    expect(JSON.stringify(user)).not.toContain(PLAIN_TEXT_PASSWORD)
  })

  test('Stamps the creation date in UTC', () => {
    // Arrange
    const { sut, attributes, localSpy, nowSpy, utcSpy } = makeSUT()

    // Act
    const user = sut.create(attributes)

    // Assert
    expect(utcSpy).toHaveBeenCalledOnce()
    expect(localSpy).not.toHaveBeenCalled()
    expect(nowSpy).not.toHaveBeenCalled()
    expect(user.createdAt.zoneName).toBe('UTC')
  })
})
