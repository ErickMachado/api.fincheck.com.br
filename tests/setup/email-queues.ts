import { type Channel } from 'amqplib'
import {
  EMAILS_DEAD_QUEUE,
  EMAILS_EXCHANGE,
  EMAILS_OUTGOING_QUEUE,
  EMAILS_RETRY_QUEUE,
  EMAILS_ROUTING_KEY
} from '@infra/queue/rabbitmq/topology'
import { poll, type PollOptions } from '@tests/setup/poll'

export type EmailQueueName = 'dead' | 'outgoing' | 'retry'

const EMAIL_QUEUE_NAMES: Record<EmailQueueName, string> = {
  dead: EMAILS_DEAD_QUEUE,
  outgoing: EMAILS_OUTGOING_QUEUE,
  retry: EMAILS_RETRY_QUEUE
}

export function publishRawEmailMessage(channel: Channel, message: unknown): void {
  channel.publish(EMAILS_EXCHANGE, EMAILS_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {
    persistent: true
  })
}

export async function emailQueueDepth(channel: Channel, queue: EmailQueueName): Promise<number> {
  const result = await channel.checkQueue(EMAIL_QUEUE_NAMES[queue])

  return result.messageCount
}

export async function pollEmailQueueDepth(
  channel: Channel,
  queue: EmailQueueName,
  minimum: number,
  options?: PollOptions
): Promise<number> {
  return poll(
    () => emailQueueDepth(channel, queue),
    (count) => count >= minimum,
    options
  )
}
