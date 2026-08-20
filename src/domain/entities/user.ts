import { ulid } from 'ulid'
import { type Email } from '@domain/value-objects/email'

type UserProperties = Readonly<{
  email: Email
  firstName: string
  lastName: string
  passwordHash: string
}>

type Metadata = Readonly<{
  createdAt: Date
  updatedAt: Date
}>

type RestoreUserProperties = UserProperties &
  Metadata &
  Readonly<{
    id: string
    isActivated: boolean
  }>

export class User {
  public readonly id: string
  public readonly email: Email
  public readonly firstName: string
  public isActivated: boolean
  public readonly lastName: string
  public readonly passwordHash: string
  public readonly createdAt: Date
  public updatedAt: Date

  private constructor(properties: RestoreUserProperties) {
    this.id = properties.id
    this.email = properties.email
    this.firstName = properties.firstName
    this.isActivated = properties.isActivated
    this.lastName = properties.lastName
    this.passwordHash = properties.passwordHash
    this.createdAt = properties.createdAt
    this.updatedAt = properties.updatedAt
  }

  public activate(): void {
    this.isActivated = true
    this.updatedAt = new Date()
  }

  public static create(properties: UserProperties): User {
    const now = new Date()

    return new User({
      ...properties,
      id: ulid(),
      isActivated: false,
      createdAt: now,
      updatedAt: now
    })
  }

  public static restore(properties: RestoreUserProperties): User {
    return new User(properties)
  }
}
