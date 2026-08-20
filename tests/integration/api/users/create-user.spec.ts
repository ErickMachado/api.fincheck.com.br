import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { Orchestrator } from '@tests/setup/orchestrator'

const ACTIVATION_LINK_PATTERN = /http:\/\/localhost:3000\/auth\/users\/activations\?token=/

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

  test('TU-03: Return 400 pointing every missing required field', async () => {
    // Act
    const response = await fetch(`${orchestrator.address}/v1/users`, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })

    // Assert
    expect(response.status).toBe(400)
    expect(pointersOf(await response.text())).toEqual(
      expect.arrayContaining(['#/first_name', '#/last_name', '#/email', '#/password'])
    )
    expect(await countUsers(orchestrator)).toBe(0)
  })

  test.each([
    ['empty', ''],
    ['longer than 100 characters', faker.string.alpha(101)]
  ])('TU-04: Return 400 pointing #/first_name when it is %s', async (_label, firstName) => {
    // Act
    const result = await orchestrator.signUp({ firstName })

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#/first_name')
    expect(await countUsers(orchestrator)).toBe(0)
  })

  test.each([
    ['empty', ''],
    ['longer than 100 characters', faker.string.alpha(101)]
  ])('TU-05: Return 400 pointing #/last_name when it is %s', async (_label, lastName) => {
    // Act
    const result = await orchestrator.signUp({ lastName })

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#/last_name')
    expect(await countUsers(orchestrator)).toBe(0)
  })

  test('TU-06: Return 400 pointing #/email for an invalid email format', async () => {
    // Act
    const result = await orchestrator.signUp({ email: faker.string.alphanumeric(12) })

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#/email')
    expect(await countUsers(orchestrator)).toBe(0)
  })

  test.each([
    ['shorter than 8 characters', faker.internet.password({ length: 7 })],
    ['longer than 64 characters', faker.internet.password({ length: 65 })]
  ])('TU-07: Return 400 pointing #/password when it is %s', async (_label, password) => {
    // Act
    const result = await orchestrator.signUp({ password })

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#/password')
    expect(await countUsers(orchestrator)).toBe(0)
  })

  test('TU-08: Send an activation email from the expected sender with the activation link', async () => {
    // Act
    const result = await orchestrator.signUp()

    // Assert
    const [message] = await orchestrator.waitForEmails(1)
    const body = await orchestrator.readEmailBody(result.input.email)
    expect(message.sender).toContain('noreply@fincheck.com.br')
    expect(body).toMatch(ACTIVATION_LINK_PATTERN)
  })

  test('TU-09: Generate a distinct token for each successful sign up', async () => {
    // Act
    const first = await orchestrator.signUp()
    const second = await orchestrator.signUp()

    // Assert
    await orchestrator.waitForEmails(2)
    const firstToken = await orchestrator.readActivationToken(first.input.email)
    const secondToken = await orchestrator.readActivationToken(second.input.email)
    expect(firstToken).not.toBe(secondToken)
  })

  test('TU-14: Return success without creating a user or sending an email for a registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email })

    // Assert
    expect(duplicate.status).toBe(204)
    expect(duplicate.body).toBe('')
    expect(await countUsers(orchestrator, first.input.email)).toBe(1)
    await orchestrator.assertNoEmailWasSent(1)
  })

  test('TU-15: Return success without issuing a new activation for a not yet activated account', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email })

    // Assert
    expect(duplicate.status).toBe(204)
    const [user] = await orchestrator.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [first.input.email.toLowerCase()]
    )
    const [activations] = await orchestrator.query<{ count: number }>(
      'SELECT COUNT(*)::int AS count FROM user_activation_tokens WHERE user_fk = $1',
      [user.id]
    )
    expect(activations.count).toBe(1)
    await orchestrator.assertNoEmailWasSent(1)
  })

  test('TU-16: Treat the same email in upper case as an already registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.waitForEmails(1)

    // Act
    const duplicate = await orchestrator.signUp({ email: first.input.email.toUpperCase() })

    // Assert
    expect(duplicate.status).toBe(204)
    expect(await countUsers(orchestrator, first.input.email)).toBe(1)
    await orchestrator.assertNoEmailWasSent(1)
  })

  test('TU-17: Create a new user for an alias derived from a registered address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.waitForEmails(1)
    const alias = aliasOf(first.input.email)

    // Act
    const result = await orchestrator.signUp({ email: alias })

    // Assert
    expect(result.status).toBe(204)
    await orchestrator.waitForEmails(2)
    expect(await orchestrator.readActivationToken(alias)).toBeTruthy()
    expect(await countUsers(orchestrator)).toBe(2)
  })

  test('TU-18: Store an alias with mixed case in lower case and email the normalized address', async () => {
    // Arrange
    const first = await orchestrator.signUp()
    await orchestrator.waitForEmails(1)
    const alias = aliasOf(first.input.email)

    // Act
    const result = await orchestrator.signUp({ email: mixCase(alias) })

    // Assert
    expect(result.status).toBe(204)
    const [user] = await orchestrator.query<{ email: string }>(
      'SELECT email FROM users WHERE email = $1',
      [alias]
    )
    expect(user.email).toBe(alias)
    expect(await orchestrator.readActivationToken(alias)).toBeTruthy()
  })

  test('TU-19: Keep the consumer alive and dead-letter a message published outside the schema', async () => {
    // Act
    orchestrator.publishRawEmail({ payload: {}, type: 'unknown' })
    const result = await orchestrator.signUp()

    // Assert
    await orchestrator.waitForEmailQueueDepth('dead', 1)
    await orchestrator.waitForEmails(1)
    expect(result.status).toBe(204)
    await orchestrator.assertNoEmailWasSent(1)
  })
})

function pointersOf(body: string): string[] {
  const problem = JSON.parse(body) as { errors: Array<{ pointer: string }> }

  return problem.errors.map((error) => error.pointer)
}

async function countUsers(orchestrator: Orchestrator, email?: string): Promise<number> {
  const sql = email
    ? 'SELECT COUNT(*)::int AS count FROM users WHERE email = $1'
    : 'SELECT COUNT(*)::int AS count FROM users'
  const [row] = await orchestrator.query<{ count: number }>(sql, email ? [email.toLowerCase()] : [])

  return row.count
}

function aliasOf(email: string): string {
  const [local, domain] = email.toLowerCase().split('@')

  return `${local}+${faker.word.sample()}@${domain}`
}

function mixCase(value: string): string {
  return value
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('')
}
