import { type User } from '@domain/entities/user'

export interface UserRepository {
  /**
   * Resolves to `false`, without throwing, when the email already belongs
   * to another user, so it does not create a duplicate account.
   */
  create(user: User): Promise<boolean>
  findById(id: string): Promise<User | null>
  update(user: User): Promise<void>
}
