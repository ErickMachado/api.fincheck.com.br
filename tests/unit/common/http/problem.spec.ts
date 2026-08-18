import { describe, expect, test } from 'vitest'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'

function makeSUT() {
  const sut = Problem

  return { sut }
}

describe('Problem', () => {
  describe('badRequest', () => {
    test('Build a problem carrying the bad request status', () => {
      // Arrange
      const { sut } = makeSUT()
      const details = {
        title: 'Malformed request body',
        detail: 'The request body is absent or could not be parsed as JSON'
      }

      // Act
      const output = sut.badRequest(details)

      // Assert
      expect(output).toBeInstanceOf(Problem)
      expect(output).toBeInstanceOf(Error)
      expect(output.name).toEqual('Problem')
      expect(output.status).toEqual(StatusCode.BadRequest)
      expect(output.status).toEqual(400)
    })

    test('Serialize the given title and detail without an errors list', () => {
      // Arrange
      const { sut } = makeSUT()
      const details = {
        title: 'Malformed request body',
        detail: 'The request body is absent or could not be parsed as JSON'
      }

      // Act
      const output = sut.badRequest(details).serialize()

      // Assert
      expect(output).toEqual({
        title: 'Malformed request body',
        detail: 'The request body is absent or could not be parsed as JSON',
        instance: undefined
      })
      expect(output).not.toHaveProperty('errors')
    })

    test('Serialize the instance set by the caller', () => {
      // Arrange
      const { sut } = makeSUT()
      const problem = sut.badRequest({
        title: 'Malformed request body',
        detail: 'The request body is absent or could not be parsed as JSON'
      })

      // Act
      problem.setInstance('/v1/users')
      const output = problem.serialize()

      // Assert
      expect(output.instance).toEqual('/v1/users')
    })
  })

  describe('conflict', () => {
    test('Build a problem carrying the conflict status', () => {
      // Arrange
      const { sut } = makeSUT()
      const details = {
        title: 'Email already in use',
        detail: 'An account with the given email address already exists'
      }

      // Act
      const output = sut.conflict(details)

      // Assert
      expect(output).toBeInstanceOf(Problem)
      expect(output).toBeInstanceOf(Error)
      expect(output.name).toEqual('Problem')
      expect(output.status).toEqual(StatusCode.Conflict)
      expect(output.status).toEqual(409)
    })

    test('Serialize the given title and detail without an errors list', () => {
      // Arrange
      const { sut } = makeSUT()
      const details = {
        title: 'Email already in use',
        detail: 'An account with the given email address already exists'
      }

      // Act
      const output = sut.conflict(details).serialize()

      // Assert
      expect(output).toEqual({
        title: 'Email already in use',
        detail: 'An account with the given email address already exists',
        instance: undefined
      })
      expect(output).not.toHaveProperty('errors')
    })
  })

  test('Keep every built problem independent from the others', () => {
    // Arrange
    const { sut } = makeSUT()

    // Act
    const first = sut.badRequest({ title: 'First', detail: 'First detail' })
    const second = sut.conflict({ title: 'Second', detail: 'Second detail' })
    first.setInstance('/v1/users')

    // Assert
    expect(first.status).toEqual(StatusCode.BadRequest)
    expect(second.status).toEqual(StatusCode.Conflict)
    expect(second.serialize().instance).toBeUndefined()
  })
})
