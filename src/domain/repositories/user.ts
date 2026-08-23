import { type User } from '@domain/entities/user'

export interface UserRepository {
  create(user: User): Promise<boolean>
  findById(id: string): Promise<User | null>
  update(user: User): Promise<void>
}
