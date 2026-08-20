import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { RabbitMQContainer, type StartedRabbitMQContainer } from '@testcontainers/rabbitmq'

const POSTGRES_IMAGE = 'postgres:18.1'
const RABBITMQ_IMAGE = 'rabbitmq:4.2-management'
const RABBITMQ_AMQP_PORT = 5672
const MAILCATCHER_IMAGE = 'sj26/mailcatcher'
const MAILCATCHER_SMTP_PORT = 1025
const MAILCATCHER_WEB_PORT = 1080

export type StartedContainers = Readonly<{
  mailcatcher: StartedTestContainer
  postgres: StartedPostgreSqlContainer
  rabbitmq: StartedRabbitMQContainer
}>

export async function startContainers(): Promise<StartedContainers> {
  const [postgres, rabbitmq, mailcatcher] = await Promise.all([
    startPostgres(),
    startRabbitMQ(),
    startMailCatcher()
  ])

  applyEnvironment({ mailcatcher, postgres, rabbitmq })

  return { mailcatcher, postgres, rabbitmq }
}

export async function stopContainers(containers: StartedContainers): Promise<void> {
  await Promise.all([
    containers.postgres.stop(),
    containers.rabbitmq.stop(),
    containers.mailcatcher.stop()
  ])
}

export function mailCatcherAddress(container: StartedTestContainer): {
  host: string
  port: number
} {
  return { host: container.getHost(), port: container.getMappedPort(MAILCATCHER_WEB_PORT) }
}

async function startPostgres(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer(POSTGRES_IMAGE)
    .withDatabase(String(process.env.POSTGRES_DATABASE))
    .withUsername(String(process.env.POSTGRES_USER))
    .withPassword(String(process.env.POSTGRES_PASSWORD))
    .start()
}

async function startRabbitMQ(): Promise<StartedRabbitMQContainer> {
  return new RabbitMQContainer(RABBITMQ_IMAGE)
    .withEnvironment({
      RABBITMQ_DEFAULT_PASS: String(process.env.RABBITMQ_PASSWORD),
      RABBITMQ_DEFAULT_USER: String(process.env.RABBITMQ_USER),
      RABBITMQ_DEFAULT_VHOST: String(process.env.RABBITMQ_VHOST)
    })
    .start()
}

async function startMailCatcher(): Promise<StartedTestContainer> {
  return new GenericContainer(MAILCATCHER_IMAGE)
    .withExposedPorts(MAILCATCHER_SMTP_PORT, MAILCATCHER_WEB_PORT)
    .withWaitStrategy(Wait.forListeningPorts())
    .start()
}

function applyEnvironment(containers: StartedContainers): void {
  process.env.POSTGRES_HOST = containers.postgres.getHost()
  process.env.POSTGRES_PORT = String(containers.postgres.getPort())

  process.env.RABBITMQ_HOST = containers.rabbitmq.getHost()
  process.env.RABBITMQ_PORT = String(containers.rabbitmq.getMappedPort(RABBITMQ_AMQP_PORT))

  process.env.SMTP_HOST = containers.mailcatcher.getHost()
  process.env.SMTP_PORT = String(containers.mailcatcher.getMappedPort(MAILCATCHER_SMTP_PORT))
}
