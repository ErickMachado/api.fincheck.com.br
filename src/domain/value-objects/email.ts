const ALIAS_SEPARATOR = '+'
const DOMAIN_SEPARATOR = '@'

export class Email {
  public readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  public static create(value: string): Email {
    const lowercased = value.toLowerCase()
    const [localPart, domain] = lowercased.split(DOMAIN_SEPARATOR)
    const aliasIndex = localPart.indexOf(ALIAS_SEPARATOR)

    if (aliasIndex <= 0) {
      return new Email(lowercased)
    }

    const normalizedLocalPart = localPart.slice(0, aliasIndex)

    return new Email(`${normalizedLocalPart}${DOMAIN_SEPARATOR}${domain}`)
  }
}
