export type ActivationMail = {
  firstName: string
  recipient: string
  token: string
}

export interface Mailer {
  sendActivation(mail: ActivationMail): Promise<void>
}
