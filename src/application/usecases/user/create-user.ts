import { type PasswordHasher } from '@application/interfaces/security/password-hasher'
import { User } from '@domain/entities/user'
import { type UsersRepository } from '@domain/repositories/users-repository'

export type CreateUserInput = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface CreateUser {
  execute(input: CreateUserInput): Promise<void>
}

export class CreateUserUseCase implements CreateUser {
  public constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  public async execute(input: CreateUserInput): Promise<void> {
    const passwordHash = await this.passwordHasher.hash(input.password)
    const user = User.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash
    })

    await this.usersRepository.create(user)
  }
}
