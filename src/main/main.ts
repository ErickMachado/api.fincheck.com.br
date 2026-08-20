import { Configuration } from '@common/core/config'
import { FincheckAPI } from '@main/app'

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const

async function main(): Promise<void> {
  const config = await Configuration.from(process.env)
  const service = await FincheckAPI.create(config)

  await service.start()

  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => service.stop())
  }
}

main()
