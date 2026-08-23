import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { EMAILS_MAX_ATTEMPTS } from '@infra/queue/rabbitmq/topology'
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

  test('TU-19: Keep the consumer alive and dead-letter a message published outside the schema', async () => {
    // Act
    orchestrator.mail.publishRaw({ payload: {}, type: 'unknown' })
    const result = await orchestrator.signUp()

    // Assert
    await orchestrator.mail.waitForQueueDepth('dead', 1)
    await orchestrator.mail.waitForEmails(1)
    expect(result.status).toBe(204)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })

  test('TU-23: Keep the consumer alive and dead-letter a message that is not valid JSON', async () => {
    // Act
    orchestrator.mail.publishMalformed()
    const result = await orchestrator.signUp()

    // Assert
    await orchestrator.mail.waitForQueueDepth('dead', 1)
    await orchestrator.mail.waitForEmails(1)
    expect(result.status).toBe(204)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })

  test('TU-24: Dead-letter a message that already exhausted every retry attempt', async () => {
    // Arrange
    const message = {
      payload: {
        firstName: faker.person.firstName(),
        recipient: faker.internet.email(),
        token: faker.string.alphanumeric(32)
      },
      type: 'activation'
    }

    // Act
    orchestrator.mail.publishWithDeaths(message, EMAILS_MAX_ATTEMPTS)
    const result = await orchestrator.signUp()

    // Assert
    await orchestrator.mail.waitForQueueDepth('dead', 1)
    await orchestrator.mail.waitForEmails(1)
    expect(result.status).toBe(204)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })
})
