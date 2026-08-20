import { type Transaction } from '@application/interfaces/transaction'
import { Activation } from '@domain/entities/activation'
import { type ActivationRepository } from '@domain/repositories/activation'
import { type UserRepository } from '@domain/repositories/user'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'

export type ActivateUserInput = Readonly<{
  token: string
}>

export type ActivateUserDependencies = Readonly<{
  activationRepository: ActivationRepository
  transaction: Transaction
  userRepository: UserRepository
}>

export class ActivateUser {
  public constructor(private readonly dependencies: ActivateUserDependencies) {}

  public async execute(input: ActivateUserInput): Promise<void> {
    const tokenHash = Activation.hashToken(input.token)

    await this.dependencies.transaction.run(() => this.consume(tokenHash))
  }

  private async consume(tokenHash: string): Promise<void> {
    const activation = await this.dependencies.activationRepository.findByTokenHash(tokenHash)

    if (!activation || !activation.isPending(new Date())) throw invalidTokenProblem()

    const user = await this.dependencies.userRepository.findById(activation.userId)

    if (!user) throw invalidTokenProblem()

    activation.consume()
    user.activate()

    await this.dependencies.activationRepository.update(activation)
    await this.dependencies.userRepository.update(user)
  }
}

function invalidTokenProblem(): Problem {
  return Problem.create({
    title: 'Invalid activation token',
    detail: 'The activation token is invalid, expired, or has already been used',
    status: StatusCode.UnprocessableContent
  })
}
