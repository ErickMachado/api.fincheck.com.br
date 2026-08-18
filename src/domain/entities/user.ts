import { DateTime } from 'luxon'
import { ulid } from 'ulid'

type UserAttributes = Readonly<{
  id: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  createdAt: DateTime
  updatedAt: DateTime
}>

export type NewUserAttributes = Readonly<{
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}>

export class User {
  private constructor(private readonly attributes: UserAttributes) {}

  public get id(): string {
    return this.attributes.id
  }

  public get firstName(): string {
    return this.attributes.firstName
  }

  public get lastName(): string {
    return this.attributes.lastName
  }

  public get email(): string {
    return this.attributes.email
  }

  public get passwordHash(): string {
    return this.attributes.passwordHash
  }

  public get createdAt(): DateTime {
    return this.attributes.createdAt
  }

  public get updatedAt(): DateTime {
    return this.attributes.updatedAt
  }

  public static create(attributes: NewUserAttributes): User {
    const createdAt = DateTime.utc()

    return new User({
      ...attributes,
      createdAt,
      id: ulid(),
      updatedAt: createdAt
    })
  }
}
