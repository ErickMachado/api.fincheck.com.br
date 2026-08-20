import { type Channel } from 'amqplib'
import { Pool, type QueryResultRow } from 'pg'
import { Configuration } from '@common/core/config'
import { migrate } from '@infra/database/migrator'
import { RabbitMQConnection } from '@infra/queue/rabbitmq/connection'
import {
  EMAILS_DEAD_QUEUE,
  EMAILS_OUTGOING_QUEUE,
  EMAILS_RETRY_QUEUE
} from '@infra/queue/rabbitmq/topology'
import { FincheckAPI } from '@main/app'
import {
  mailCatcherAddress,
  startContainers,
  type StartedContainers
} from '@tests/setup/containers'
import { MailCatcherClient, type MailCatcherMessage } from '@tests/setup/mailcatcher'
import { poll, type PollOptions } from '@tests/setup/poll'

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

  public async waitForEmails(count: number, options?: PollOptions): Promise<MailCatcherMessage[]> {
    return poll(
      () => this.mailcatcher.list(),
      (messages) => messages.length >= count,
      options
    )
  }

  public async assertNoEmailWasSent(options?: PollOptions): Promise<void> {
    await poll(
      () => this.channel.checkQueue(EMAILS_OUTGOING_QUEUE),
      (result) => result.messageCount === 0,
      options
    )
    const messages = await this.mailcatcher.list()

    if (messages.length > 0) throw new Error('Uma mensagem inesperada chegou à caixa de e-mail')
  }

  public async stop(): Promise<void> {
    await this.api.stop()
    await this.channel.close()
    await this.connection.close()
    await this.pool.end()
    await Promise.all([
      this.containers.postgres.stop(),
      this.containers.rabbitmq.stop(),
      this.containers.mailcatcher.stop()
    ])
  }

  public static async start(): Promise<Orchestrator> {
    const containers = await startContainers()
    const config = await Configuration.from(process.env)
    await migrate(config, { direction: 'up' })

    const api = await FincheckAPI.create(config)
    await api.start()
    const pool = new Pool(config.postgres)
    const connection = await RabbitMQConnection.connect(config.rabbitmq)
    const channel = await connection.openChannel()
    const { host, port } = mailCatcherAddress(containers.mailcatcher)
    const mailcatcher = MailCatcherClient.create(host, port)

    return new Orchestrator(containers, api, pool, connection, channel, mailcatcher)
  }
}
