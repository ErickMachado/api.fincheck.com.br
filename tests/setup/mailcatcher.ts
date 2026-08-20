const MESSAGES_PATH = '/messages'

type RawMailCatcherMessage = Readonly<{
  id: number
  sender: string
  recipients: string[]
  subject: string
  created_at: string
}>

export type MailCatcherMessage = Readonly<{
  id: number
  sender: string
  recipients: string[]
  subject: string
  createdAt: string
}>

export class MailCatcherClient {
  private constructor(private readonly baseUrl: string) {}

  public async list(): Promise<MailCatcherMessage[]> {
    const response = await fetch(`${this.baseUrl}${MESSAGES_PATH}`)
    const messages = (await response.json()) as RawMailCatcherMessage[]

    return messages.map(toMailCatcherMessage)
  }

  public async body(id: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}${MESSAGES_PATH}/${id}.html`)

    return response.text()
  }

  public async clear(): Promise<void> {
    await fetch(`${this.baseUrl}${MESSAGES_PATH}`, { method: 'DELETE' })
  }

  public static create(host: string, port: number): MailCatcherClient {
    return new MailCatcherClient(`http://${host}:${port}`)
  }
}

function toMailCatcherMessage(raw: RawMailCatcherMessage): MailCatcherMessage {
  return {
    createdAt: raw.created_at,
    id: raw.id,
    recipients: raw.recipients,
    sender: raw.sender,
    subject: raw.subject
  }
}
