import {
  EMAILS_DEAD_QUEUE,
  EMAILS_OUTGOING_QUEUE,
  EMAILS_RETRY_QUEUE
} from '@infra/queue/rabbitmq/topology'
import {
  bootstrapOrchestrator,
  type BootstrapOptions,
  type BootstrappedOrchestrator
} from '@tests/setup/bootstrap'
import { stopContainers } from '@tests/setup/containers'
import {
  emailQueueDepth,
  pollEmailQueueDepth,
  publishRawEmailMessage,
  type EmailQueueName
} from '@tests/setup/email-queues'
import { type MailCatcherMessage } from '@tests/setup/mailcatcher'
import { poll, type PollOptions } from '@tests/setup/poll'
import {
  fetchEmailBody,
  findActivationToken,
  requestActivation,
  requestSignUp,
  type ActivationResult,
  type SignUpInput,
  type SignUpResult
} from '@tests/setup/users'
import { type QueryResultRow } from 'pg'

const TRUNCATE_TABLES_SQL = 'TRUNCATE TABLE users, user_activation_tokens CASCADE'
const EMAIL_QUEUES = [EMAILS_OUTGOING_QUEUE, EMAILS_RETRY_QUEUE, EMAILS_DEAD_QUEUE]

export class Orchestrator {
  private constructor(private readonly deps: BootstrappedOrchestrator) {}

  public get address(): string {
    return this.deps.api.address
  }

  public async cleanup(): Promise<void> {
    await this.deps.pool.query(TRUNCATE_TABLES_SQL)
    await Promise.all(EMAIL_QUEUES.map((queue) => this.deps.channel.purgeQueue(queue)))
    if (!this.deps.mailcatcherStopped) await this.deps.mailcatcher.clear()
  }

  public async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = []
  ): Promise<T[]> {
    const result = await this.deps.pool.query<T>(sql, params)

    return result.rows
  }

  public async signUp(overrides: Partial<SignUpInput> = {}): Promise<SignUpResult> {
    return requestSignUp(this.address, overrides)
  }

  public async activate(token: string): Promise<ActivationResult> {
    return requestActivation(this.address, token)
  }

  public async readActivationToken(recipient: string, options?: PollOptions): Promise<string> {
    return findActivationToken(this.deps.mailcatcher, recipient, options)
  }

  public async readEmailBody(recipient: string, options?: PollOptions): Promise<string> {
    return fetchEmailBody(this.deps.mailcatcher, recipient, options)
  }

  public async waitForEmails(count: number, options?: PollOptions): Promise<MailCatcherMessage[]> {
    return poll(
      () => this.deps.mailcatcher.list(),
      (messages) => messages.length >= count,
      options
    )
  }

  public async assertNoEmailWasSent(expectedCount = 0, options?: PollOptions): Promise<void> {
    await poll(
      () => emailQueueDepth(this.deps.channel, 'outgoing'),
      (count) => count === 0,
      options
    )
    const messages = await this.deps.mailcatcher.list()

    if (messages.length > expectedCount)
      throw new Error('Uma mensagem inesperada chegou à caixa de e-mail')
  }

  public publishRawEmail(message: unknown): void {
    publishRawEmailMessage(this.deps.channel, message)
  }

  public async waitForEmailQueueDepth(
    queue: EmailQueueName,
    minimum: number,
    options?: PollOptions
  ): Promise<number> {
    return pollEmailQueueDepth(this.deps.channel, queue, minimum, options)
  }

  public async stop(): Promise<void> {
    await this.deps.api.stop()
    await this.deps.channel.close()
    await this.deps.connection.close()
    await this.deps.pool.end()
    await stopContainers(this.deps.containers, { skipMailcatcher: this.deps.mailcatcherStopped })
  }

  public static async start(options?: BootstrapOptions): Promise<Orchestrator> {
    return new Orchestrator(await bootstrapOrchestrator(options))
  }
}
