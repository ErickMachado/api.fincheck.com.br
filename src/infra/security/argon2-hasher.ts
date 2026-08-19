import { Algorithm, hash } from '@node-rs/argon2'

import { type Hasher } from '@application/interfaces/hasher'

const MEMORY_COST_IN_KIB = 19 * 1024
const TIME_COST = 2
const PARALLELISM = 1

export class Argon2Hasher implements Hasher {
  public async hash(plain: string): Promise<string> {
    return hash(plain, {
      algorithm: Algorithm.Argon2id,
      memoryCost: MEMORY_COST_IN_KIB,
      parallelism: PARALLELISM,
      timeCost: TIME_COST
    })
  }
}
