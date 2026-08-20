import { type Mailer } from '@application/interfaces/mailer'
import { type PasswordHasher } from '@application/interfaces/password-hasher'
import { type Transaction } from '@application/interfaces/transaction'
import { Activation } from '@domain/entities/activation'
import { User } from '@domain/entities/user'
import { type ActivationRepository } from '@domain/repositories/activation'
import { type UserRepository } from '@domain/repositories/user'
import { Email } from '@domain/value-objects/email'

export type CreateUserInput = Readonly<{
  email: string
  firstName: string
  lastName: string
  password: string
}>

export type CreateUserDependencies = Readonly<{
  activationRepository: ActivationRepository
  mailer: Mailer
  passwordHasher: PasswordHasher
  transaction: Transaction
  userRepository: UserRepository
}>

type PersistedActivation = Readonly<{
  email: Email
  firstName: string
  token: string
}>

export class CreateUser {
  public constructor(private readonly dependencies: CreateUserDependencies) {}

  public async execute(input: CreateUserInput): Promise<void> {
    const email = Email.create(input.email)
    const passwordHash = await this.dependencies.passwordHasher.hash(input.password)

    const issued = await this.dependencies.transaction.run(() =>
      this.persist({ ...input, email, passwordHash })
    )

    if (!issued) return

    await this.dependencies.mailer.sendActivation({
      firstName: issued.firstName,
      recipient: issued.email.toString(),
      token: issued.token
    })
  }

  private async persist(
    input: Omit<CreateUserInput, 'email' | 'password'> & { email: Email; passwordHash: string }
  ): Promise<PersistedActivation | null> {
    const user = User.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash: input.passwordHash
    })

    const created = await this.dependencies.userRepository.create(user)

    if (!created) return null

    const { activation, token } = Activation.issue(user.id)

    await this.dependencies.activationRepository.create(activation)

    return { email: input.email, firstName: input.firstName, token }
  }
}
