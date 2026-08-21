import { type AddressInfo } from 'node:net'
import { fastify, type FastifyInstance } from 'fastify'
import { type Configuration } from '@common/core/config'
import { createMessagingDependencies, type MessagingDependencies } from '@main/factories/messaging'
import {
  createPersistenceDependencies,
  type PersistenceDependencies
} from '@main/factories/persistence'
import { createUsecases } from '@main/factories/usecases'
import { problem } from '@main/plugins/problem'
import { registerRoutes } from '@main/router'

export class FincheckAPI {
  private constructor(
    private readonly app: FastifyInstance,
    private readonly config: Configuration,
    private readonly messaging: MessagingDependencies,
    private readonly persistence: PersistenceDependencies
  ) {}

  public get address(): string {
    const info = this.app.server.address()

    /* v8 ignore start -- `address` is only queried by the test orchestrator after a successful `start`, so the server is always listening */
    if (!info || typeof info === 'string') {
      throw new Error('Server address is not available')
    }
    /* v8 ignore stop */

    return `http://${this.host(info)}:${info.port}`
  }

  public async start(): Promise<void> {
    await this.app.listen({
      host: this.config.app.host,
      port: this.config.app.port
    })
  }

  public async stop(): Promise<void> {
    await this.app.close()
    await this.messaging.consumerChannel.close()
    await this.messaging.connection.close()
    this.messaging.transport.close()
    await this.persistence.connection.close()
  }

  public static async create(config: Configuration): Promise<FincheckAPI> {
    const app = fastify()

    app.setErrorHandler(problem)

    const persistence = createPersistenceDependencies(config)
    const messaging = await createMessagingDependencies(config)
    const usecases = createUsecases(persistence, messaging)

    registerRoutes(app, usecases)

    return new FincheckAPI(app, config, messaging, persistence)
  }

  private host(info: AddressInfo): string {
    const LOOPBACK_HOST = '127.0.0.1'

    /* v8 ignore next -- the test environment always binds to `0.0.0.0`; a specific bind host is not exercised */
    return this.config.app.host === '0.0.0.0' ? LOOPBACK_HOST : info.address
  }
}
