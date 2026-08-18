import { type User } from '@domain/entities/user'

export interface UsersRepository {
  create(user: User): Promise<void>
}
