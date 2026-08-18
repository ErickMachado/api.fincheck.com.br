import { type User } from '@domain/entities/user'
import { type UsersRepository } from '@domain/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public readonly users: User[] = []

  public create(user: User): Promise<void> {
    this.users.push(user)

    return Promise.resolve()
  }
}
