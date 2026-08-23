import { Configuration } from '@common/core/config'
import { FincheckAPI } from '@main/app'

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const
const SUCCESS_EXIT_CODE = 0
const FAILURE_EXIT_CODE = 1

async function main(): Promise<void> {
  const config = await Configuration.from(process.env)
  const service = await FincheckAPI.create(config)

  await service.start()

  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => {
      shutdown(service)
    })
  }
}

function shutdown(service: FincheckAPI): void {
  service
    .stop()
    .then(() => process.exit(SUCCESS_EXIT_CODE))
    .catch(fail)
}

function fail(error: unknown): never {
  const details = error instanceof Error ? (error.stack ?? error.message) : String(error)

  process.stderr.write(`${details}\n`)

  return process.exit(FAILURE_EXIT_CODE)
}

main().catch(fail)
