import { Algorithm, hash } from '@node-rs/argon2'
import { type PasswordHasher } from '@application/interfaces/security/password-hasher'

const MEMORY_COST_IN_KIB = 19456
const PARALLELISM = 1
const TIME_COST = 2

export class Argon2PasswordHasher implements PasswordHasher {
  public async hash(plainText: string): Promise<string> {
    return hash(plainText, {
      algorithm: Algorithm.Argon2id,
      memoryCost: MEMORY_COST_IN_KIB,
      parallelism: PARALLELISM,
      timeCost: TIME_COST
    })
  }
}
