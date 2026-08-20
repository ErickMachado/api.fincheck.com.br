import { z } from 'zod'

const ACTIVATION_MAIL_SCHEMA = z.object({
  firstName: z.string().min(1),
  recipient: z.email(),
  token: z.string().min(1)
})

export const EMAIL_MESSAGE_SCHEMA = z.discriminatedUnion('type', [
  z.object({
    payload: ACTIVATION_MAIL_SCHEMA,
    type: z.literal('activation')
  })
])

export type EmailMessage = z.infer<typeof EMAIL_MESSAGE_SCHEMA>
