import { Configuration } from '@common/core/config'
import { FincheckAPI } from '@main/app'

async function main(): Promise<void> {
  const config = await Configuration.from(process.env)
  const service = await FincheckAPI.create(config)

  await service.start()
}

main()
