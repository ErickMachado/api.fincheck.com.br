import { type Email } from '@domain/value-objects/email'
import { ulid } from 'ulidx'

type CreateUserProperties = Readonly<{
  email: Email
  firstName: string
  lastName: string
  passwordHash: string
}>

export class User {
  public readonly id: string
  public readonly email: string
  public readonly firstName: string
  public readonly lastName: string
  public readonly passwordHash: string
  public verifiedAt: Date | null
  public readonly createdAt: Date
  public updatedAt: Date

  private constructor(properties: {
    id: string
    email: string
    firstName: string
    lastName: string
    passwordHash: string
    verifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = properties.id
    this.email = properties.email
    this.firstName = properties.firstName
    this.lastName = properties.lastName
    this.passwordHash = properties.passwordHash
    this.verifiedAt = properties.verifiedAt
    this.createdAt = properties.createdAt
    this.updatedAt = properties.updatedAt
  }

  public static create(properties: CreateUserProperties): User {
    const now = new Date()

    return new User({
      id: ulid(),
      email: properties.email.value,
      firstName: properties.firstName,
      lastName: properties.lastName,
      passwordHash: properties.passwordHash,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now
    })
  }
}
