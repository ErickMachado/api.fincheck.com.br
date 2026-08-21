import { type Channel, type ConsumeMessage } from 'amqplib'
import { type ZodType } from 'zod'

const PREFETCH_COUNT = 1

type ParseResult<T> = { success: true; data: T } | { success: false }

type ConsumeOptions<T> = {
  channel: Channel
  deadLetterQueue: string
  handler: (message: T) => Promise<void>
  maxAttempts: number
  queue: string
  schema: ZodType<T>
}

export class RabbitMQConsumer {
  public static async consume<T>(options: ConsumeOptions<T>): Promise<void> {
    await options.channel.prefetch(PREFETCH_COUNT)

    await options.channel.consume(options.queue, (message) => {
      /* v8 ignore next -- a null message only arrives on broker-initiated consumer cancellation, not triggered by the current scenarios */
      if (!message) return

      void RabbitMQConsumer.process(options, message)
    })
  }

  private static async process<T>(
    options: ConsumeOptions<T>,
    message: ConsumeMessage
  ): Promise<void> {
    const parsed = RabbitMQConsumer.parse(options.schema, message)

    if (!parsed.success || RabbitMQConsumer.attempts(message) >= options.maxAttempts) {
      RabbitMQConsumer.deadLetter(options, message)
      return
    }

    await RabbitMQConsumer.handle(options, parsed.data, message)
  }

  private static parse<T>(schema: ZodType<T>, message: ConsumeMessage): ParseResult<T> {
    try {
      return schema.safeParse(JSON.parse(message.content.toString('utf-8')))
    } catch {
      return { success: false }
    }
  }

  private static async handle<T>(
    options: ConsumeOptions<T>,
    data: T,
    message: ConsumeMessage
  ): Promise<void> {
    try {
      await options.handler(data)
      options.channel.ack(message)
    } catch {
      options.channel.nack(message, false, false)
    }
  }

  private static deadLetter<T>(options: ConsumeOptions<T>, message: ConsumeMessage): void {
    options.channel.sendToQueue(options.deadLetterQueue, message.content, { persistent: true })
    options.channel.ack(message)
  }

  private static attempts(message: ConsumeMessage): number {
    const deaths = message.properties.headers?.['x-death']

    if (!Array.isArray(deaths) || deaths.length === 0) return 0

    return Math.max(...deaths.map((death) => death.count))
  }
}
