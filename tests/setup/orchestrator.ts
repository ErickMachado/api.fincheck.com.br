import { type Channel } from 'amqplib'
import { type Pool, type QueryResultRow } from 'pg'
import { type RabbitMQConnection } from '@infra/queue/rabbitmq/connection'
import {
  EMAILS_DEAD_QUEUE,
  EMAILS_OUTGOING_QUEUE,
  EMAILS_RETRY_QUEUE
} from '@infra/queue/rabbitmq/topology'
import { type FincheckAPI } from '@main/app'
import { bootstrapOrchestrator } from '@tests/setup/bootstrap'
import { stopContainers, type StartedContainers } from '@tests/setup/containers'
import { type MailCatcherClient, type MailCatcherMessage } from '@tests/setup/mailcatcher'
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

const TRUNCATE_TABLES_SQL = 'TRUNCATE TABLE users, user_activation_tokens CASCADE'
const EMAIL_QUEUES = [EMAILS_OUTGOING_QUEUE, EMAILS_RETRY_QUEUE, EMAILS_DEAD_QUEUE]

export class Orchestrator {
  private constructor(
    private readonly containers: StartedContainers,
    private readonly api: FincheckAPI,
    private readonly pool: Pool,
    private readonly connection: RabbitMQConnection,
    private readonly channel: Channel,
    private readonly mailcatcher: MailCatcherClient
  ) {}

  public get address(): string {
    return this.api.address
  }

  public async cleanup(): Promise<void> {
    await this.pool.query(TRUNCATE_TABLES_SQL)
    await Promise.all(EMAIL_QUEUES.map((queue) => this.channel.purgeQueue(queue)))
    await this.mailcatcher.clear()
  }

  public async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = []
  ): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params)

    return result.rows
  }

  public async signUp(overrides: Partial<SignUpInput> = {}): Promise<SignUpResult> {
    return requestSignUp(this.address, overrides)
  }

  public async activate(token: string): Promise<ActivationResult> {
    return requestActivation(this.address, token)
  }

  public async readActivationToken(recipient: string, options?: PollOptions): Promise<string> {
    return findActivationToken(this.mailcatcher, recipient, options)
  }

  public async readEmailBody(recipient: string, options?: PollOptions): Promise<string> {
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
      () => this.channel.checkQueue(EMAILS_OUTGOING_QUEUE),
      (result) => result.messageCount === 0,
      options
    )
    const messages = await this.mailcatcher.list()

    if (messages.length > expectedCount)
      throw new Error('Uma mensagem inesperada chegou à caixa de e-mail')
  }

  public async stop(): Promise<void> {
    await this.api.stop()
    await this.channel.close()
    await this.connection.close()
    await this.pool.end()
    await stopContainers(this.containers)
  }

  public static async start(): Promise<Orchestrator> {
    const { api, channel, connection, containers, mailcatcher, pool } =
      await bootstrapOrchestrator()

    return new Orchestrator(containers, api, pool, connection, channel, mailcatcher)
  }
}
