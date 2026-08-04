import { fastify, type FastifyInstance } from 'fastify'
import { type Configuration } from '@common/core/config'

export class FincheckAPI {
  private constructor(
    private readonly app: FastifyInstance,
    private readonly config: Configuration
  ) {}

  public async start(): Promise<void> {
    await this.app.listen({
      host: this.config.app.host,
      port: this.config.app.port
    })
  }

  public async stop(): Promise<void> {
    await this.app.close()
  }

  public static async create(config: Configuration): Promise<FincheckAPI> {
    const app = fastify()

    return new FincheckAPI(app, config)
  }
}
