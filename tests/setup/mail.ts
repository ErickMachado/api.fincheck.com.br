import { type Channel } from 'amqplib'
import { fetchEmailBody, findActivationToken } from '@tests/setup/activation-emails'
import {
  emailQueueDepth,
  pollEmailQueueDepth,
  publishEmailMessageWithDeaths,
  publishMalformedEmailMessage,
  publishRawEmailMessage,
  type EmailQueueName
} from '@tests/setup/email-queues'
import { type MailCatcherClient, type MailCatcherMessage } from '@tests/setup/mailcatcher'
import { poll, type PollOptions } from '@tests/setup/poll'

export class MailOrchestrator {
  public constructor(
    private readonly channel: Channel,
    private readonly mailcatcher: MailCatcherClient
  ) {}

  public async readActivationToken(recipient: string, options?: PollOptions): Promise<string> {
    return findActivationToken(this.mailcatcher, recipient, options)
  }

  public async readBody(recipient: string, options?: PollOptions): Promise<string> {
    return fetchEmailBody(this.mailcatcher, recipient, options)
  }

  public async waitForEmails(count: number, options?: PollOptions): Promise<MailCatcherMessage[]> {
    return poll(
      () => this.mailcatcher.list(),
      (messages) => messages.length >= count,
      options
    )
  }

  public async assertNoEmailWasSent(expectedCount = 0, options?: PollOptions): Promise<void> {
    await poll(
      () => emailQueueDepth(this.channel, 'outgoing'),
      (count) => count === 0,
      options
    )
    const messages = await this.mailcatcher.list()

    if (messages.length > expectedCount)
      throw new Error('Uma mensagem inesperada chegou à caixa de e-mail')
  }

  public publishRaw(message: unknown): void {
    publishRawEmailMessage(this.channel, message)
  }

  public publishWithDeaths(message: unknown, deathCount: number): void {
    publishEmailMessageWithDeaths(this.channel, message, deathCount)
  }

  public publishMalformed(): void {
    publishMalformedEmailMessage(this.channel)
  }

  public async waitForQueueDepth(
    queue: EmailQueueName,
    minimum: number,
    options?: PollOptions
  ): Promise<number> {
    return pollEmailQueueDepth(this.channel, queue, minimum, options)
  }
}
