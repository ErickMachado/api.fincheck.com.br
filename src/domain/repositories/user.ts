import { type User } from '@domain/entities/user'
import { type UserActivationToken } from '@domain/entities/user-activation-token'

export type CreateUserInput = Readonly<{
  token: UserActivationToken
  user: User
}>

export interface UserRepository {
  activateUser(token: UserActivationToken): Promise<boolean>
  create(input: CreateUserInput): Promise<boolean>
  findActivationToken(value: string): Promise<UserActivationToken | null>
}
