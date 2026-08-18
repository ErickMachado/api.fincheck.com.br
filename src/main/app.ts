import { fastify, type FastifyInstance } from 'fastify'
import { CreateUserController } from '@application/controllers/user/create-user'
import { CreateUserUseCase } from '@application/usecases/user/create-user'
import { type Configuration } from '@common/core/config'
import { DatabaseConnection } from '@infra/database/connection'
import { PostgresUsersRepository } from '@infra/database/repositories/postgres-users-repository'
import { Argon2PasswordHasher } from '@infra/security/argon2-password-hasher'
import { problem } from '@main/plugins/problem'
import { router } from '@main/router'

export class FincheckAPI {
  private constructor(
    private readonly app: FastifyInstance,
    private readonly config: Configuration,
    private readonly connection: DatabaseConnection
  ) {}

  public get address(): string {
    return this.app.listeningOrigin
  }

  public async start(): Promise<void> {
    await this.app.listen({
      host: this.config.app.host,
      port: this.config.app.port
    })
  }

  public async stop(): Promise<void> {
    await this.app.close()
    await this.connection.disconnect()
  }

  public static async create(config: Configuration): Promise<FincheckAPI> {
    const app = fastify()
    const connection = DatabaseConnection.create(config)
    const usersRepository = new PostgresUsersRepository(connection)
    const passwordHasher = new Argon2PasswordHasher()
    const createUser = new CreateUserUseCase(usersRepository, passwordHasher)

    app.setErrorHandler(problem)

    await app.register(router({ createUser: new CreateUserController(createUser) }))

    return new FincheckAPI(app, config, connection)
  }
}
