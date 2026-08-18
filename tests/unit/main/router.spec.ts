import { fastify } from 'fastify'
import { describe, expect, test, vi } from 'vitest'
import { type CreateUserController } from '@application/controllers/user/create-user'
import { type HttpRequest, type HttpResponse } from '@common/http/messages'
import { StatusCode } from '@common/http/statuses'
import { router } from '@main/router'

function makeSUT(response: HttpResponse = { status: StatusCode.NoContent }) {
  const handle = vi.fn(async (_request: HttpRequest): Promise<HttpResponse> => response)
  const createUser = { handle } as unknown as CreateUserController
  const sut = fastify()

  sut.register(router({ createUser }))

  return { sut, createUser: handle }
}

describe('router', () => {
  test('Declare the create user route under the version one prefix', async () => {
    // Arrange
    const { sut } = makeSUT()

    // Act
    const response = await sut.inject({ method: 'POST', url: '/users', payload: {} })

    // Assert
    expect(response.statusCode).toEqual(404)
  })

  test('Hand the request body to the create user controller', async () => {
    // Arrange
    const { sut, createUser } = makeSUT()
    const payload = {
      email: 'tifa.lockhart@gmail.com',
      first_name: 'Tifa',
      last_name: 'Lockhart',
      password: 'm1dg4r 1s 4ws0m3'
    }

    // Act
    await sut.inject({ method: 'POST', url: '/v1/users', payload })

    // Assert
    expect(createUser).toHaveBeenCalledOnce()
    expect(createUser).toHaveBeenCalledWith({ body: payload })
  })

  test('Answer the created account without a body', async () => {
    // Arrange
    const { sut } = makeSUT()

    // Act
    const response = await sut.inject({ method: 'POST', url: '/v1/users', payload: {} })

    // Assert
    expect(response.statusCode).toEqual(StatusCode.NoContent)
    expect(response.body).toEqual('')
    expect(response.headers['content-type']).toBeUndefined()
  })

  test('Answer with the status and the body returned by the controller', async () => {
    // Arrange
    const body = { user: { id: '01M063ET5G1JAXFBKESMJKJ9G3' } }
    const { sut } = makeSUT({ body, status: StatusCode.Conflict })

    // Act
    const response = await sut.inject({ method: 'POST', url: '/v1/users', payload: {} })

    // Assert
    expect(response.statusCode).toEqual(StatusCode.Conflict)
    expect(response.json()).toEqual(body)
  })
})
