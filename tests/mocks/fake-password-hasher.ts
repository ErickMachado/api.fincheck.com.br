import { type PasswordHasher } from '@application/interfaces/security/password-hasher'

const PREFIX = 'fake-hash'

export class FakePasswordHasher implements PasswordHasher {
  public hash(plainText: string): Promise<string> {
    const digest = Buffer.from(plainText, 'utf8').toString('base64url')

    return Promise.resolve(`${PREFIX}:${digest}`)
  }
}
