import { describe, expect, test } from 'vitest'
import { Argon2PasswordHasher } from '@infra/security/argon2-password-hasher'

function makeSUT() {
  const sut = new Argon2PasswordHasher()

  return { sut }
}

describe('Argon2PasswordHasher', () => {
  test('Produce a PHC string of Argon2id with the OWASP parameters', async () => {
    // Arrange
    const { sut } = makeSUT()
    const plainText = 'cavalo bateria grampo correto'

    // Act
    const output = await sut.hash(plainText)

    // Assert
    expect(output.startsWith('$argon2id$')).toBe(true)
    expect(output).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/)
    expect(output).not.toContain(plainText)
  })

  test('Produce a different hash on every call for the same password', async () => {
    // Arrange
    const { sut } = makeSUT()
    const plainText = 'cavalo bateria grampo correto'

    // Act
    const first = await sut.hash(plainText)
    const second = await sut.hash(plainText)

    // Assert
    expect(first).not.toEqual(second)
    expect(first.startsWith('$argon2id$')).toBe(true)
    expect(second.startsWith('$argon2id$')).toBe(true)
  })
})
