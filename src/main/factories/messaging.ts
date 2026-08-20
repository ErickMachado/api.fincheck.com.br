import { type Channel } from 'amqplib'
import { type Configuration } from '@common/core/config'
import { type Mailer } from '@application/interfaces/mailer'
import { type EmailDispatcher, TemplateEmailDispatcher } from '@infra/email/dispatcher'
import { QueuedMailer } from '@infra/email/queued-mailer'
import { EmailTransport } from '@infra/email/transport'
import { EMAIL_MESSAGE_SCHEMA } from '@infra/queue/messages'
import { RabbitMQConnection } from '@infra/queue/rabbitmq/connection'
import { RabbitMQConsumer } from '@infra/queue/rabbitmq/consumer'
import {
  declareEmailsTopology,
  EMAILS_DEAD_QUEUE,
  EMAILS_MAX_ATTEMPTS,
  EMAILS_OUTGOING_QUEUE
} from '@infra/queue/rabbitmq/topology'

export type MessagingDependencies = Readonly<{
  connection: RabbitMQConnection
  consumerChannel: Channel
  mailer: Mailer
  transport: EmailTransport
}>

export async function createMessagingDependencies(
  config: Configuration
): Promise<MessagingDependencies> {
  const connection = await RabbitMQConnection.connect(config.rabbitmq)
  const publishChannel = await connection.openConfirmChannel()
  const consumerChannel = await connection.openChannel()

  await declareEmailsTopology(publishChannel)

  const transport = EmailTransport.create(config.smtp)

  await startEmailConsumer(consumerChannel, new TemplateEmailDispatcher(transport, config))

  return {
    connection,
    consumerChannel,
    mailer: new QueuedMailer(publishChannel),
    transport
  }
}

async function startEmailConsumer(channel: Channel, dispatcher: EmailDispatcher): Promise<void> {
  await RabbitMQConsumer.consume({
    channel,
    deadLetterQueue: EMAILS_DEAD_QUEUE,
    handler: (message) => dispatcher.dispatch(message),
    maxAttempts: EMAILS_MAX_ATTEMPTS,
    queue: EMAILS_OUTGOING_QUEUE,
    schema: EMAIL_MESSAGE_SCHEMA
  })
}
