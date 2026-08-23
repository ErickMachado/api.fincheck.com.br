import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { Orchestrator } from '@tests/setup/orchestrator'

describe('POST /v1/users', () => {
  let orchestrator: Orchestrator

  beforeAll(async () => {
    orchestrator = await Orchestrator.start({ simulateEmailOutage: true })
  })

  afterAll(async () => {
    await orchestrator.stop()
  })

  beforeEach(async () => {
    await orchestrator.cleanup()
  })

  test('TU-20: Return 204, persist the user and retain the message when the SMTP server is unavailable', async () => {
    // Act
    const result = await orchestrator.signUp()

    // Assert
    expect(result.status).toBe(204)
    expect(result.body).toBe('')
    const [user] = await orchestrator.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [result.input.email.toLowerCase()]
    )
    expect(user).toBeTruthy()
    await orchestrator.mail.waitForQueueDepth('retry', 1)
  })
})
