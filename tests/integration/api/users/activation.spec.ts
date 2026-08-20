import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { Activation } from '@domain/entities/activation'
import { Orchestrator } from '@tests/setup/orchestrator'

describe('POST /v1/users/activations', () => {
  let orchestrator: Orchestrator

  beforeAll(async () => {
    orchestrator = await Orchestrator.start()
  })

  afterAll(async () => {
    await orchestrator.stop()
  })

  beforeEach(async () => {
    await orchestrator.cleanup()
  })

  test('TU-10: Return 204 with empty body and activate the account for a valid, unused token', async () => {
    // Arrange
    const signUp = await orchestrator.signUp()
    const token = await orchestrator.readActivationToken(signUp.input.email)

    // Act
    const result = await orchestrator.activate(token)

    // Assert
    expect(result.status).toBe(204)
    expect(result.body).toBe('')
    expect(await isActivated(orchestrator, signUp.input.email)).toBe(true)
  })

  test('TU-11: Return the generic error for a nonexistent token', async () => {
    // Act
    const result = await orchestrator.activate(faker.string.alphanumeric(32))

    // Assert
    expect(result.status).toBe(422)
  })

  test('TU-12: Return the generic error for a token whose validity has already expired', async () => {
    // Arrange
    const signUp = await orchestrator.signUp()
    const token = await orchestrator.readActivationToken(signUp.input.email)
    const expiredAt = new Date(Date.now() - 1)
    await orchestrator.query(
      'UPDATE user_activation_tokens SET expires_at = $2 WHERE token_hash = $1',
      [Activation.hashToken(token), expiredAt]
    )

    // Act
    const result = await orchestrator.activate(token)

    // Assert
    expect(result.status).toBe(422)
    expect(await isActivated(orchestrator, signUp.input.email)).toBe(false)
  })

  test('TU-13: Return the generic error for a second activation using the same token', async () => {
    // Arrange
    const signUp = await orchestrator.signUp()
    const token = await orchestrator.readActivationToken(signUp.input.email)
    await orchestrator.activate(token)

    // Act
    const result = await orchestrator.activate(token)

    // Assert
    expect(result.status).toBe(422)
    expect(await isActivated(orchestrator, signUp.input.email)).toBe(true)
  })
})

async function isActivated(orchestrator: Orchestrator, email: string): Promise<boolean> {
  const [user] = await orchestrator.query<{ is_activated: boolean }>(
    'SELECT is_activated FROM users WHERE email = $1',
    [email.toLowerCase()]
  )

  return user.is_activated
}
