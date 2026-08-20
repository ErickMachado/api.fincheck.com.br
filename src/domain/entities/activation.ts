import { createHash, randomBytes } from 'node:crypto'
import { ulid } from 'ulid'

const TOKEN_BYTE_LENGTH = 32
const ACTIVATION_TTL_MINUTES = 15
const MILLISECONDS_PER_MINUTE = 60_000

type ActivationProperties = Readonly<{
  id: string
  userId: string
  consumedAt: Date | null
  expiresAt: Date
  tokenHash: string
  createdAt: Date
}>

type IssuedActivation = Readonly<{
  activation: Activation
  token: string
}>

export class Activation {
  public readonly id: string
  public readonly userId: string
  public consumedAt: Date | null
  public readonly expiresAt: Date
  public readonly tokenHash: string
  public readonly createdAt: Date

  private constructor(properties: ActivationProperties) {
    this.id = properties.id
    this.userId = properties.userId
    this.consumedAt = properties.consumedAt
    this.expiresAt = properties.expiresAt
    this.tokenHash = properties.tokenHash
    this.createdAt = properties.createdAt
  }

  public consume(): void {
    this.consumedAt = new Date()
  }

  public isPending(reference: Date): boolean {
    return this.consumedAt === null && reference.getTime() < this.expiresAt.getTime()
  }

  public static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  public static issue(userId: string): IssuedActivation {
    const token = randomBytes(TOKEN_BYTE_LENGTH).toString('base64url')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + ACTIVATION_TTL_MINUTES * MILLISECONDS_PER_MINUTE)

    const activation = new Activation({
      id: ulid(),
      userId,
      consumedAt: null,
      expiresAt,
      tokenHash: Activation.hashToken(token),
      createdAt: now
    })

    return { activation, token }
  }

  public static restore(properties: ActivationProperties): Activation {
    return new Activation(properties)
  }
}
