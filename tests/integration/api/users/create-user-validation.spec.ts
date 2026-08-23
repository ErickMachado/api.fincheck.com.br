import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { countUsers } from '@tests/setup/database'
import { Orchestrator } from '@tests/setup/orchestrator'
import { pointersOf } from '@tests/setup/problems'

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

  test('TU-03: Return 400 pointing every missing required field', async () => {
    // Act
    const result = await orchestrator.signUpWithBody('{}')

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toEqual(
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

  test('TU-21: Return 400 pointing # for a request body that is not an object', async () => {
    // Act
    const result = await orchestrator.signUpWithBody('[]')

    // Assert
    expect(result.status).toBe(400)
    expect(pointersOf(result.body)).toContain('#')
  })

  test('TU-22: Return 400 for a malformed JSON body', async () => {
    // Act
    const result = await orchestrator.signUpWithBody('{"email":')

    // Assert
    expect(result.status).toBe(400)
  })
})
