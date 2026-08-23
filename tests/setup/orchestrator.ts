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
import { MailOrchestrator } from '@tests/setup/mail'
import {
  requestActivation,
  requestRawActivation,
  requestRawSignUp,
  requestSignUp,
  type RequestResult,
  type SignUpInput,
  type SignUpResult
} from '@tests/setup/users'
import { type QueryResultRow } from 'pg'

const TRUNCATE_TABLES_SQL = 'TRUNCATE TABLE users, user_activation_tokens CASCADE'
const EMAIL_QUEUES = [EMAILS_OUTGOING_QUEUE, EMAILS_RETRY_QUEUE, EMAILS_DEAD_QUEUE]

export class Orchestrator {
  public readonly mail: MailOrchestrator

  private constructor(private readonly deps: BootstrappedOrchestrator) {
    this.mail = new MailOrchestrator(deps.channel, deps.mailcatcher)
  }

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

  public async signUpWithBody(body: string): Promise<RequestResult> {
    return requestRawSignUp(this.address, body)
  }

  public async activate(token: string): Promise<RequestResult> {
    return requestActivation(this.address, token)
  }

  public async activateWithBody(body: string): Promise<RequestResult> {
    return requestRawActivation(this.address, body)
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
