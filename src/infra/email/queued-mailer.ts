import { type ConfirmChannel } from 'amqplib'
import { type ActivationMail, type Mailer } from '@application/interfaces/mailer'
import { type EmailMessage } from '@infra/queue/messages'
import { RabbitMQPublisher } from '@infra/queue/rabbitmq/publisher'
import { EMAILS_EXCHANGE, EMAILS_ROUTING_KEY } from '@infra/queue/rabbitmq/topology'

export class QueuedMailer implements Mailer {
  public constructor(private readonly channel: ConfirmChannel) {}

  public async sendActivation(mail: ActivationMail): Promise<void> {
    await this.publish({ payload: mail, type: 'activation' })
  }

  private async publish(message: EmailMessage): Promise<void> {
    await RabbitMQPublisher.publish(message, {
      channel: this.channel,
      exchange: EMAILS_EXCHANGE,
      routingKey: EMAILS_ROUTING_KEY
    })
  }
}
