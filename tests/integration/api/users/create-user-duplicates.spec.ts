import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { countActivations, countUsers, storedEmail } from '@tests/setup/database'
import { Orchestrator } from '@tests/setup/orchestrator'
import { aliasOf, mixCase } from '@tests/setup/users'

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

  test('TU-14: Return success without creating a user or sending an email for a registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.mail.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email })

    // Assert
    expect(duplicate.status).toBe(204)
    expect(duplicate.body).toBe('')
    expect(await countUsers(orchestrator, first.input.email)).toBe(1)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })

  test('TU-15: Return success without issuing a new activation for a not yet activated account', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.mail.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email })

    // Assert
    expect(duplicate.status).toBe(204)
    expect(await countActivations(orchestrator, first.input.email)).toBe(1)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })

  test('TU-16: Treat the same email in upper case as an already registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.mail.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email.toUpperCase() })

    // Assert
    expect(duplicate.status).toBe(204)
    expect(await countUsers(orchestrator, first.input.email)).toBe(1)
    await orchestrator.mail.assertNoEmailWasSent(1)
  })

  test('TU-17: Create a new user for an alias derived from a registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.mail.waitForEmails(1)
    const alias = aliasOf(first.input.email)

    // Act
    const result = await orchestrator.signUp({ email: alias })

    // Assert
    expect(result.status).toBe(204)
    await orchestrator.mail.waitForEmails(2)
    expect(await orchestrator.mail.readActivationToken(alias)).toBeTruthy()
    expect(await countUsers(orchestrator)).toBe(2)
  })

  test('TU-18: Store an alias with mixed case in lower case and email the normalized address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.mail.waitForEmails(1)
    const alias = aliasOf(first.input.email)

    // Act
    const result = await orchestrator.signUp({ email: mixCase(alias) })

    // Assert
    expect(result.status).toBe(204)
    expect(await storedEmail(orchestrator, alias)).toBe(alias)
    expect(await orchestrator.mail.readActivationToken(alias)).toBeTruthy()
  })
})
