import { type ConfirmChannel } from 'amqplib'

type PublishOptions = {
  channel: ConfirmChannel
  exchange: string
  routingKey: string
}

export class RabbitMQPublisher {
  public static publish(message: unknown, options: PublishOptions): Promise<void> {
    const content = Buffer.from(JSON.stringify(message))

    return new Promise<void>((resolve, reject) => {
      options.channel.publish(
        options.exchange,
        options.routingKey,
        content,
        { persistent: true },
        (error) => {
          if (error) {
            reject(error instanceof Error ? error : new Error(String(error)))
            return
          }

          resolve()
        }
      )
    })
  }
}
