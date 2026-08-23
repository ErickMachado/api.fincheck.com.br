import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { activationLinkPattern } from '@tests/setup/activation-emails'
import { Orchestrator } from '@tests/setup/orchestrator'

describe('POST /v1/users', () => {
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

  test('TU-01: Return 204 with empty body for a valid sign up', async () => {
    // Act
    const result = await orchestrator.signUp()

    // Assert
    expect(result.status).toBe(204)
    expect(result.body).toBe('')
  })

  test('TU-02: Persist the user as not activated right after sign up', async () => {
    // Act
    const result = await orchestrator.signUp()

    // Assert
    const [user] = await orchestrator.query<{ is_activated: boolean }>(
      'SELECT is_activated FROM users WHERE email = $1',
      [result.input.email.toLowerCase()]
    )
    expect(user.is_activated).toBe(false)
  })

  test('TU-08: Send an activation email from the expected sender with the activation link', async () => {
    // Act
    const result = await orchestrator.signUp()

    // Assert
    const [message] = await orchestrator.mail.waitForEmails(1)
    const body = await orchestrator.mail.readBody(result.input.email)
    expect(message.sender).toContain(String(process.env.MAIL_FROM_ADDRESS))
    expect(body).toMatch(activationLinkPattern())
  })

  test('TU-09: Generate a distinct token for each successful sign up', async () => {
    // Act
    const first = await orchestrator.signUp()
    const second = await orchestrator.signUp()

    // Assert
    await orchestrator.mail.waitForEmails(2)
    const firstToken = await orchestrator.mail.readActivationToken(first.input.email)
    const secondToken = await orchestrator.mail.readActivationToken(second.input.email)
    expect(firstToken).not.toBe(secondToken)
  })
})
