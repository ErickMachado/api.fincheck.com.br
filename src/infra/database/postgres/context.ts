import { AsyncLocalStorage } from 'node:async_hooks'
import { type Pool, type PoolClient } from 'pg'

export type Executor = Pool | PoolClient

export class TransactionContext {
  private readonly storage = new AsyncLocalStorage<PoolClient>()

  private constructor(private readonly pool: Pool) {}

  public current(): PoolClient | undefined {
    return this.storage.getStore()
  }

  public resolve(): Executor {
    return this.storage.getStore() ?? this.pool
  }

  public run<T>(client: PoolClient, handler: () => Promise<T>): Promise<T> {
    return this.storage.run(client, handler)
  }

  public static create(pool: Pool): TransactionContext {
    return new TransactionContext(pool)
  }
}
