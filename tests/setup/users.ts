import { faker } from '@faker-js/faker'
import { type MailCatcherClient, type MailCatcherMessage } from '@tests/setup/mailcatcher'
import { poll, type PollOptions } from '@tests/setup/poll'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64
const TOKEN_PATTERN = /token=([^&"'\s]+)/

export type SignUpInput = Readonly<{
  email: string
  firstName: string
  lastName: string
  password: string
}>

export type SignUpResult = Readonly<{
  body: string
  input: SignUpInput
  status: number
}>

export function buildSignUpInput(overrides: Partial<SignUpInput> = {}): SignUpInput {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({
      length: faker.number.int({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
    }),
    ...overrides
  }
}

export async function requestSignUp(
  address: string,
  overrides: Partial<SignUpInput> = {}
): Promise<SignUpResult> {
  const input = buildSignUpInput(overrides)

  const response = await fetch(`${address}/v1/users`, {
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      password: input.password
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  })

  return { body: await response.text(), input, status: response.status }
}

export async function findActivationToken(
  mailcatcher: MailCatcherClient,
  recipient: string,
  options?: PollOptions
): Promise<string> {
  return extractActivationToken(await fetchEmailBody(mailcatcher, recipient, options))
}

export async function fetchEmailBody(
  mailcatcher: MailCatcherClient,
  recipient: string,
  options?: PollOptions
): Promise<string> {
  const messages = await poll(
    () => mailcatcher.list(),
    (messages) => messages.some((message) => matchesRecipient(message, recipient)),
    options
  )
  const message = messages.find((candidate) => matchesRecipient(candidate, recipient))

  if (!message) throw new Error('Mensagem de ativação não encontrada para o destinatário')

  return mailcatcher.body(message.id)
}

function matchesRecipient(message: MailCatcherMessage, recipient: string): boolean {
  const normalized = recipient.toLowerCase()

  return message.recipients.some((address) => address.toLowerCase().includes(normalized))
}

function extractActivationToken(source: string): string {
  const match = TOKEN_PATTERN.exec(source)

  if (!match) throw new Error('Token de ativação não encontrado na mensagem')

  return decodeURIComponent(match[1])
}
