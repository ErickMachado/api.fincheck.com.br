import { type MailCatcherClient, type MailCatcherMessage } from '@tests/setup/mailcatcher'
import { poll, type PollOptions } from '@tests/setup/poll'

const ACTIVATION_PATH = '/auth/users/activations'
const TOKEN_PATTERN = /token=([^&"'\s]+)/
const REGEXP_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g

export function activationLinkPattern(): RegExp {
  const link = `${String(process.env.APP_WEB_URL)}${ACTIVATION_PATH}?token=`

  return new RegExp(link.replace(REGEXP_SPECIAL_CHARACTERS, '\\$&'))
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
