import { type Channel } from 'amqplib'
import { Pool } from 'pg'
import { Configuration } from '@common/core/config'
import { migrate } from '@infra/database/migrator'
import { RabbitMQConnection } from '@infra/queue/rabbitmq/connection'
import { FincheckAPI } from '@main/app'
import {
  mailCatcherAddress,
  startContainers,
  type StartedContainers
} from '@tests/setup/containers'
import { MailCatcherClient } from '@tests/setup/mailcatcher'

export type BootstrapOptions = Readonly<{
  simulateEmailOutage?: boolean
}>

export type BootstrappedOrchestrator = Readonly<{
  api: FincheckAPI
  channel: Channel
  connection: RabbitMQConnection
  containers: StartedContainers
  mailcatcher: MailCatcherClient
  mailcatcherStopped: boolean
  pool: Pool
}>

export async function bootstrapOrchestrator(
  options: BootstrapOptions = {}
): Promise<BootstrappedOrchestrator> {
  const containers = await startContainers()
  const config = await Configuration.from(process.env)
  await migrate(config, { direction: 'up' })

  const api = await FincheckAPI.create(config)
  await api.start()

  const mailcatcherStopped = Boolean(options.simulateEmailOutage)
  if (mailcatcherStopped) await containers.mailcatcher.stop()

  const pool = new Pool(config.postgres)
  const connection = await RabbitMQConnection.connect(config.rabbitmq)
  const channel = await connection.openChannel()
  const { host, port } = mailCatcherAddress(containers.mailcatcher)
  const mailcatcher = MailCatcherClient.create(host, port)

  return { api, channel, connection, containers, mailcatcher, mailcatcherStopped, pool }
}
