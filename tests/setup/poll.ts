const DEFAULT_INTERVAL_MS = 200
const DEFAULT_TIMEOUT_MS = 5_000

export type PollOptions = Readonly<{
  intervalMs?: number
  timeoutMs?: number
}>

export async function poll<T>(
  fn: () => Promise<T>,
  isDone: (value: T) => boolean,
  options: PollOptions = {}
): Promise<T> {
  const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS
  const deadline = Date.now() + (options.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  let value = await fn()

  while (!isDone(value)) {
    if (Date.now() >= deadline) {
      throw new Error('Tempo esgotado aguardando a condição da sondagem')
    }

    await sleep(intervalMs)
    value = await fn()
  }

  return value
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
