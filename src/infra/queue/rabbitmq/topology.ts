import { type Channel } from 'amqplib'

export const EMAILS_EXCHANGE = 'fincheck.emails'
export const EMAILS_RETRY_EXCHANGE = 'fincheck.emails.retry'
export const EMAILS_ROUTING_KEY = 'send'
export const EMAILS_OUTGOING_QUEUE = 'emails.outgoing'
export const EMAILS_RETRY_QUEUE = 'emails.retry'
export const EMAILS_DEAD_QUEUE = 'emails.dead'
export const EMAILS_RETRY_TTL_MS = 30_000
export const EMAILS_MAX_ATTEMPTS = 5

export async function declareEmailsTopology(channel: Channel): Promise<void> {
  await channel.assertExchange(EMAILS_EXCHANGE, 'direct', { durable: true })
  await channel.assertExchange(EMAILS_RETRY_EXCHANGE, 'direct', { durable: true })

  await channel.assertQueue(EMAILS_OUTGOING_QUEUE, {
    deadLetterExchange: EMAILS_RETRY_EXCHANGE,
    deadLetterRoutingKey: EMAILS_ROUTING_KEY,
    durable: true
  })
  await channel.bindQueue(EMAILS_OUTGOING_QUEUE, EMAILS_EXCHANGE, EMAILS_ROUTING_KEY)

  await channel.assertQueue(EMAILS_RETRY_QUEUE, {
    deadLetterExchange: EMAILS_EXCHANGE,
    deadLetterRoutingKey: EMAILS_ROUTING_KEY,
    durable: true,
    messageTtl: EMAILS_RETRY_TTL_MS
  })
  await channel.bindQueue(EMAILS_RETRY_QUEUE, EMAILS_RETRY_EXCHANGE, EMAILS_ROUTING_KEY)

  await channel.assertQueue(EMAILS_DEAD_QUEUE, { durable: true })
}
