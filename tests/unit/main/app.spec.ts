import { afterEach, describe, expect, test, vi } from 'vitest'
import { Configuration } from '@common/core/config'
import { StatusCode } from '@common/http/statuses'
import { DatabaseConnection } from '@infra/database/connection'
import { FincheckAPI } from '@main/app'

async function makeSUT() {
  const config = await Configuration.from({
    APP_ENV: 'test',
    APP_HOST: '127.0.0.1',
    APP_PORT: '0',
    DATABASE_URL: 'postgres://postgres:postgres@127.0.0.1:5435/fincheck'
  })
  const disconnect = vi.spyOn(DatabaseConnection.prototype, 'disconnect').mockResolvedValue()
  const sut = await FincheckAPI.create(config)

  return { sut, disconnect }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('FincheckAPI', () => {
  test('Expose the address the server bound to instead of the configured port', async () => {
    // Arrange
    const { sut } = await makeSUT()

    // Act
    await sut.start()
    const address = sut.address

    // Assert
    expect(address).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/)
    expect(address).not.toContain(':0')

    await sut.stop()
  })

  test('Serve the create user route', async () => {
    // Arrange
    const { sut } = await makeSUT()

    // Act
    await sut.start()
    const response = await fetch(`${sut.address}/v1/users`, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })
    const body = await response.json()

    // Assert
    expect(response.status).toEqual(StatusCode.BadRequest)
    expect(body).toMatchObject({ title: 'Request validation failed', instance: '/v1/users' })

    await sut.stop()
  })

  test('Disconnect from the database when stopped', async () => {
    // Arrange
    const { sut, disconnect } = await makeSUT()

    await sut.start()

    // Act
    await sut.stop()

    // Assert
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('Refuse connections once stopped', async () => {
    // Arrange
    const { sut } = await makeSUT()

    await sut.start()
    const address = sut.address

    // Act
    await sut.stop()

    // Assert
    await expect(fetch(`${address}/v1/users`, { method: 'POST' })).rejects.toThrow()
  })
})
