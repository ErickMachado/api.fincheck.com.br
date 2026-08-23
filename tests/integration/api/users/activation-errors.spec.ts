import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { orphanActivation } from '@tests/setup/database'
import { Orchestrator } from '@tests/setup/orchestrator'
import { pointersOf } from '@tests/setup/problems'

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

  test('TU-25: Return 400 pointing #/token for a request without a token', async () => {
    // Act
    const result = await orchestrator.activateWithBody('{}')

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#/token')
  })

  test('TU-26: Return 400 for a malformed JSON body', async () => {
    // Act
    const result = await orchestrator.activateWithBody('{"token":')

    // Assert
    expect(result.status).toBe(400)
  })

  test('TU-27: Return the generic error for a pending token whose account no longer exists', async () => {
    // Arrange
    const signUp = await orchestrator.signUp()
    const token = await orchestrator.mail.readActivationToken(signUp.input.email)
    await orphanActivation(orchestrator, signUp.input.email)

    // Act
    const result = await orchestrator.activate(token)

    // Assert
    expect(result.status).toBe(422)
  })
})
