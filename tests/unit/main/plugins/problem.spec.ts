import { errorCodes, type FastifyReply, type FastifyRequest } from 'fastify'
import { describe, expect, test, vi } from 'vitest'
import { z, ZodError } from 'zod'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'
import { problem } from '@main/plugins/problem'

function makeSUT() {
  const reply = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis()
  }
  const request = { url: '/v1/users' } as FastifyRequest

  return {
    sut: problem,
    reply: reply as unknown as FastifyReply,
    replySpies: reply,
    request
  }
}

function makeZodError(): ZodError {
  const schema = z.object({ email: z.string() })
  const result = schema.safeParse({})

  return result.error as ZodError
}

describe('problem', () => {
  test('Answer an unknown error as an internal server error', () => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()
    const error = new Error('Something went wrong')

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.code).toHaveBeenCalledWith(StatusCode.InternalServerError)
    expect(replySpies.send).toHaveBeenCalledWith({
      title: 'Internal Server Error',
      detail: 'An unknown error prevented the server from responding your request',
      instance: '/v1/users'
    })
  })

  test('Answer an error carrying an unrelated code as an internal server error', () => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()
    const error = Object.assign(new Error('aborted'), { code: 'ECONNRESET' })

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.code).toHaveBeenCalledWith(StatusCode.InternalServerError)
  })

  test('Answer a validation error with the problem built from the Zod issues', () => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()
    const error = makeZodError()

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.code).toHaveBeenCalledWith(StatusCode.BadRequest)
    expect(replySpies.send).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Request validation failed',
        errors: [expect.objectContaining({ pointer: '#/email' })]
      })
    )
  })

  test.each([
    ['FST_ERR_CTP_EMPTY_JSON_BODY', new errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY()],
    ['FST_ERR_CTP_INVALID_JSON_BODY', new errorCodes.FST_ERR_CTP_INVALID_JSON_BODY()],
    ['FST_ERR_CTP_INVALID_MEDIA_TYPE', new errorCodes.FST_ERR_CTP_INVALID_MEDIA_TYPE()],
    ['FST_ERR_CTP_INVALID_CONTENT_LENGTH', new errorCodes.FST_ERR_CTP_INVALID_CONTENT_LENGTH()]
  ])('Answer %s as a bad request', (_code, error) => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.code).toHaveBeenCalledWith(StatusCode.BadRequest)
    expect(replySpies.send).toHaveBeenCalledWith({
      title: 'Malformed request body',
      detail: 'The request body is absent or could not be parsed as JSON',
      instance: '/v1/users'
    })
  })

  test('Answer a body parse error with a bad request instead of the status of Fastify', () => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()
    const error = new errorCodes.FST_ERR_CTP_INVALID_MEDIA_TYPE()

    // Act
    sut(error, request, reply)

    // Assert
    expect(error.statusCode).toEqual(415)
    expect(replySpies.code).toHaveBeenCalledWith(400)
    expect(replySpies.code).not.toHaveBeenCalledWith(415)
  })

  test('Preserve a problem raised by a lower layer', () => {
    // Arrange
    const { sut, reply, replySpies, request } = makeSUT()
    const error = Problem.conflict({
      title: 'Email already in use',
      detail: 'An account with the given email address already exists'
    })

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.code).toHaveBeenCalledWith(StatusCode.Conflict)
    expect(replySpies.send).toHaveBeenCalledWith({
      title: 'Email already in use',
      detail: 'An account with the given email address already exists',
      instance: '/v1/users'
    })
  })

  test('Stamp the requested url as the instance of the problem', () => {
    // Arrange
    const { sut, reply, replySpies } = makeSUT()
    const request = { url: '/v1/users?page=2' } as FastifyRequest
    const error = new Error('Something went wrong')

    // Act
    sut(error, request, reply)

    // Assert
    expect(replySpies.send).toHaveBeenCalledWith(
      expect.objectContaining({ instance: '/v1/users?page=2' })
    )
  })
})
