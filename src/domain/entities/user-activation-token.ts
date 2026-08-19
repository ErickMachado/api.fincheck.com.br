import { randomBytes } from 'node:crypto'
import { ulid } from 'ulidx'

const ACTIVATION_TOKEN_TTL_MS = 15 * 60 * 1000
const ACTIVATION_TOKEN_BYTES = 16

type RestoreTokenProperties = Readonly<{
  createdAt: Date
  expiresAt: Date
  id: string
  usedAt: Date | null
  userId: string
  value: string
}>

export class UserActivationToken {
  public readonly id: string
  public readonly userId: string
  public readonly expiresAt: Date
  public usedAt: Date | null
  public readonly value: string
  public readonly createdAt: Date

  private constructor(properties: RestoreTokenProperties) {
    this.id = properties.id
    this.userId = properties.userId
    this.expiresAt = properties.expiresAt
    this.usedAt = properties.usedAt
    this.value = properties.value
    this.createdAt = properties.createdAt
  }

  public static create(userId: string): UserActivationToken {
    const createdAt = new Date()

    return new UserActivationToken({
      id: ulid(),
      userId,
      expiresAt: new Date(createdAt.getTime() + ACTIVATION_TOKEN_TTL_MS),
      usedAt: null,
      value: randomBytes(ACTIVATION_TOKEN_BYTES).toString('hex'),
      createdAt
    })
  }

  public static restore(properties: RestoreTokenProperties): UserActivationToken {
    return new UserActivationToken(properties)
  }

  public isUsable(): boolean {
    return this.usedAt === null && this.expiresAt > new Date()
  }
}
