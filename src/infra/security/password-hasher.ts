import { type PasswordHasher } from '@application/interfaces/password-hasher'
import { Algorithm, hash } from '@node-rs/argon2'

const ARGON2_MEMORY_COST_KIB = 19456
const ARGON2_TIME_COST = 2
const ARGON2_PARALLELISM = 1

export class Argon2PasswordHasher implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    return hash(password, {
      algorithm: Algorithm.Argon2id,
      memoryCost: ARGON2_MEMORY_COST_KIB,
      parallelism: ARGON2_PARALLELISM,
      timeCost: ARGON2_TIME_COST
    })
  }
}
