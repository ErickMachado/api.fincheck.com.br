import { beforeEach, describe, expect, test, vi } from 'vitest'
import { z, ZodError } from 'zod'
import { CreateUserController, createUserSchema } from '@application/controllers/user/create-user'
import { CreateUserUseCase } from '@application/usecases/user/create-user'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'
import { FakePasswordHasher } from '../../../../mocks/fake-password-hasher'
import { InMemoryUsersRepository } from '../../../../mocks/in-memory-users-repository'

const PASS_PHRASE = 'cavalo bateria grampo correto'

function makeSUT() {
  const passwordHasher = new FakePasswordHasher()
  const usersRepository = new InMemoryUsersRepository()
  const createUser = new CreateUserUseCase(usersRepository, passwordHasher)
  const sut = new CreateUserController(createUser)
  const executeSpy = vi.spyOn(createUser, 'execute')
  const body = {
    email: 'Tifa.Lockhart@Gmail.com',
    first_name: 'Tifa',
    last_name: 'Lockhart',
    password: PASS_PHRASE
  }

  return { sut, body, createUser, executeSpy, usersRepository }
}

function makeValidBody(overrides: Record<string, unknown> = {}) {
  return {
    email: 'tifa.lockhart@gmail.com',
    first_name: 'Tifa',
    last_name: 'Lockhart',
    password: PASS_PHRASE,
    ...overrides
  }
}

function pointersOf(error: ZodError): string[] {
  return error.issues.map((issue) => issue.path.join('/'))
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('CreateUserController.handle', () => {
  test('Answers 204 without a body when every field is valid', async () => {
    // Arrange
    const { sut, body, executeSpy, usersRepository } = makeSUT()

    // Act
    const response = await sut.handle({ body })

    // Assert
    expect(response).toEqual({ status: StatusCode.NoContent })
    expect(response.status).toBe(204)
    expect(response.body).toBeUndefined()
    expect(executeSpy).toHaveBeenCalledOnce()
    expect(usersRepository.users).toHaveLength(1)
  })

  test('Trims the edges of the names and the email before handing them over', async () => {
    // Arrange
    const { sut, executeSpy } = makeSUT()
    const body = makeValidBody({
      email: '  Tifa.Lockhart@Gmail.com  ',
      first_name: '  Tifa  ',
      last_name: '  Lockhart  '
    })

    // Act
    const response = await sut.handle({ body })

    // Assert
    expect(response.status).toBe(StatusCode.NoContent)
    expect(executeSpy).toHaveBeenCalledWith({
      email: 'Tifa.Lockhart@Gmail.com',
      firstName: 'Tifa',
      lastName: 'Lockhart',
      password: PASS_PHRASE
    })
  })

  test('Hands the password over exactly as it was sent', async () => {
    // Arrange
    const { sut, executeSpy } = makeSUT()
    const paddedPassword = `  ${PASS_PHRASE}  `
    const body = makeValidBody({ password: paddedPassword })

    // Act
    await sut.handle({ body })
    const [input] = executeSpy.mock.calls[0]

    // Assert
    expect(input.password).toBe(paddedPassword)
    expect(input.password).not.toBe(PASS_PHRASE)
  })

  test('Ignores keys that the body does not declare', async () => {
    // Arrange
    const { sut, executeSpy } = makeSUT()
    const body = makeValidBody({ id: '01M063ET5G1JAXFBKESMJKJ9G3', role: 'admin' })

    // Act
    const response = await sut.handle({ body })

    // Assert
    expect(response.status).toBe(StatusCode.NoContent)
    expect(executeSpy).toHaveBeenCalledWith({
      email: 'tifa.lockhart@gmail.com',
      firstName: 'Tifa',
      lastName: 'Lockhart',
      password: PASS_PHRASE
    })
  })

  test('Accepts names written with accent, hyphen and apostrophe', async () => {
    // Arrange
    const { sut, executeSpy } = makeSUT()
    const body = makeValidBody({ first_name: "D'Ávila", last_name: 'Saint-Exupéry' })

    // Act
    const response = await sut.handle({ body })

    // Assert
    expect(response.status).toBe(StatusCode.NoContent)
    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "D'Ávila", lastName: 'Saint-Exupéry' })
    )
  })

  test('Refuses an invalid body without reaching the use case', async () => {
    // Arrange
    const { sut, executeSpy, usersRepository } = makeSUT()
    const body = makeValidBody({ email: 'tifa@' })

    // Act
    const promise = sut.handle({ body })

    // Assert
    await expect(promise).rejects.toBeInstanceOf(ZodError)
    expect(executeSpy).not.toHaveBeenCalled()
    expect(usersRepository.users).toHaveLength(0)
  })
})

describe('createUserSchema', () => {
  test('Gathers the errors of every field into a single failure', () => {
    // Arrange
    const body = {
      email: 'tifa@',
      first_name: 'T',
      last_name: '',
      password: 'short'
    }

    // Act
    const result = createUserSchema.safeParse(body)
    const errors = Problem.fromZod(result.error as ZodError).serialize().errors

    // Assert
    expect(result.success).toBe(false)
    expect(pointersOf(result.error as ZodError)).toEqual([
      'email',
      'first_name',
      'last_name',
      'password'
    ])
    expect(errors).toHaveLength(4)
  })

  test('Points out every required field that is missing', () => {
    // Act
    const result = createUserSchema.safeParse({})

    // Assert
    expect(result.success).toBe(false)
    expect(pointersOf(result.error as ZodError)).toEqual([
      'email',
      'first_name',
      'last_name',
      'password'
    ])
  })

  test('Trims the edges of the names and of the email before validating', () => {
    // Arrange
    const body = makeValidBody({
      email: '  Tifa.Lockhart@Gmail.com  ',
      first_name: '  Tifa  ',
      last_name: '  Lockhart  '
    })

    // Act
    const result = createUserSchema.safeParse(body)

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.first_name).toBe('Tifa')
    expect(result.data?.last_name).toBe('Lockhart')
    expect(result.data?.email).toBe('Tifa.Lockhart@Gmail.com')
  })

  test('Trims the email before checking its format, and not after', () => {
    // Arrange
    const paddedEmail = '  Tifa.Lockhart@Gmail.com  '
    const trimAfterFormat = z.email().trim()

    // Act
    const trimBeforeFormat = createUserSchema.safeParse(makeValidBody({ email: paddedEmail }))
    const chained = trimAfterFormat.safeParse(paddedEmail)

    // Assert
    expect(trimBeforeFormat.success).toBe(true)
    expect(trimBeforeFormat.data?.email).toBe('Tifa.Lockhart@Gmail.com')
    expect(chained.success).toBe(false)
  })

  test('Does not trim the password', () => {
    // Arrange
    const paddedPassword = `  ${PASS_PHRASE}  `

    // Act
    const result = createUserSchema.safeParse(makeValidBody({ password: paddedPassword }))

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.password).toBe(paddedPassword)
  })

  test('Keeps the email spelling untouched', () => {
    // Arrange
    const email = 'Tifa.Lockhart+fincheck@Gmail.com'

    // Act
    const result = createUserSchema.safeParse(makeValidBody({ email }))

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.email).toBe(email)
  })

  test('Accepts names on both ends of the allowed length', () => {
    // Arrange
    const shortest = 'Ti'
    const longest = 'T'.repeat(50)

    // Act
    const result = createUserSchema.safeParse(
      makeValidBody({ first_name: shortest, last_name: longest })
    )

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.first_name).toBe(shortest)
    expect(result.data?.last_name).toBe(longest)
  })

  test('Refuses names outside the allowed length', () => {
    // Arrange
    const tooShort = makeValidBody({ first_name: 'T', last_name: 'L' })
    const tooLong = makeValidBody({ first_name: 'T'.repeat(51), last_name: 'L'.repeat(51) })

    // Act
    const shortResult = createUserSchema.safeParse(tooShort)
    const longResult = createUserSchema.safeParse(tooLong)

    // Assert
    expect(pointersOf(shortResult.error as ZodError)).toEqual(['first_name', 'last_name'])
    expect(shortResult.error?.issues[0].code).toBe('too_small')
    expect(pointersOf(longResult.error as ZodError)).toEqual(['first_name', 'last_name'])
    expect(longResult.error?.issues[0].code).toBe('too_big')
  })

  test('Refuses a name that is only spaces', () => {
    // Act
    const result = createUserSchema.safeParse(makeValidBody({ first_name: '   ' }))

    // Assert
    expect(pointersOf(result.error as ZodError)).toEqual(['first_name'])
  })

  test('Refuses an email without address format', () => {
    // Arrange
    const withoutDomain = makeValidBody({ email: 'tifa@' })
    const withoutAt = makeValidBody({ email: 'tifa.gmail.com' })

    // Act
    const withoutDomainResult = createUserSchema.safeParse(withoutDomain)
    const withoutAtResult = createUserSchema.safeParse(withoutAt)

    // Assert
    expect(pointersOf(withoutDomainResult.error as ZodError)).toEqual(['email'])
    expect(pointersOf(withoutAtResult.error as ZodError)).toEqual(['email'])
  })

  test('Refuses an email longer than the allowed length', () => {
    // Arrange
    const domain = '@gmail.com'
    const longest = `${'t'.repeat(254 - domain.length)}${domain}`
    const tooLong = `${'t'.repeat(255 - domain.length)}${domain}`

    // Act
    const longestResult = createUserSchema.safeParse(makeValidBody({ email: longest }))
    const tooLongResult = createUserSchema.safeParse(makeValidBody({ email: tooLong }))

    // Assert
    expect(longestResult.success).toBe(true)
    expect(pointersOf(tooLongResult.error as ZodError)).toEqual(['email'])
    expect(tooLongResult.error?.issues[0].code).toBe('too_big')
  })

  test('Accepts passwords on both ends of the allowed length', () => {
    // Arrange
    const shortest = 'a'.repeat(8)
    const longest = 'a'.repeat(64)

    // Act
    const shortestResult = createUserSchema.safeParse(makeValidBody({ password: shortest }))
    const longestResult = createUserSchema.safeParse(makeValidBody({ password: longest }))

    // Assert
    expect(shortestResult.data?.password).toBe(shortest)
    expect(longestResult.data?.password).toBe(longest)
  })

  test('Refuses passwords outside the allowed length', () => {
    // Arrange
    const tooShort = makeValidBody({ password: 'a'.repeat(7) })
    const tooLong = makeValidBody({ password: 'a'.repeat(65) })

    // Act
    const shortResult = createUserSchema.safeParse(tooShort)
    const longResult = createUserSchema.safeParse(tooLong)

    // Assert
    expect(pointersOf(shortResult.error as ZodError)).toEqual(['password'])
    expect(shortResult.error?.issues[0].code).toBe('too_small')
    expect(pointersOf(longResult.error as ZodError)).toEqual(['password'])
    expect(longResult.error?.issues[0].code).toBe('too_big')
  })

  test('Accepts a password without uppercase, digit or symbol', () => {
    // Arrange
    const password = 'cavalobateria'

    // Act
    const result = createUserSchema.safeParse(makeValidBody({ password }))

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.password).toBe(password)
  })
})
