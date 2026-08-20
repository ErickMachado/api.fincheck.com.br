import { z } from 'zod'

const EMAIL_MAX_LENGTH = 254

const EMAIL_SCHEMA = z
  .string()
  .trim()
  .toLowerCase()
  .max(EMAIL_MAX_LENGTH, { error: 'Must be at most 254 characters long' })
  .pipe(z.email({ error: 'Must be a valid email address' }))

export class Email {
  public readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Email {
    return new Email(EMAIL_SCHEMA.parse(value))
  }
}
