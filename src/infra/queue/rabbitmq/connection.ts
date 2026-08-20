import amqplib, { type Channel, type ConfirmChannel, type RecoveringChannelModel } from 'amqplib'
import { type Configuration } from '@common/core/config'

export class RabbitMQConnection {
  private constructor(private readonly model: RecoveringChannelModel) {}

  public async openChannel(): Promise<Channel> {
    return this.model.createChannel()
  }

  public async openConfirmChannel(): Promise<ConfirmChannel> {
    return this.model.createConfirmChannel()
  }

  public onReconnect(listener: () => void): void {
    this.model.on('connect', listener)
  }

  public async close(): Promise<void> {
    await this.model.close()
  }

  public static async connect(config: Configuration['rabbitmq']): Promise<RabbitMQConnection> {
    const model = await amqplib.connect(
      {
        hostname: config.host,
        password: config.password,
        port: config.port,
        username: config.user,
        vhost: config.vhost
      },
      { recovery: true }
    )

    return new RabbitMQConnection(model)
  }
}
