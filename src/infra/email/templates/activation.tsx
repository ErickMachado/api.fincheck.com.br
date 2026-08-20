import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from '@infra/email/templates/layout'

const ACTIVATION_LINK_TTL_MINUTES = 15
const ACTIVATION_PATH = '/auth/users/activations'

export const ACTIVATION_EMAIL_SUBJECT = 'Ative sua conta no Fincheck'

type ActivationEmailProps = {
  firstName: string
  token: string
  webUrl: string
}

export function ActivationEmail({ firstName, token, webUrl }: ActivationEmailProps) {
  const activationLink = `${webUrl}${ACTIVATION_PATH}?token=${token}`
  const preview = `Ative sua conta no Fincheck, ${firstName}`

  return (
    <EmailLayout preview={preview}>
      <Text className="text-base text-slate-700">Olá, {firstName}!</Text>
      <Text className="text-base text-slate-700">
        Confirme seu endereço de e-mail para ativar sua conta no Fincheck.
      </Text>
      <Section className="my-6 text-center">
        <Button
          className="rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white"
          href={activationLink}
        >
          Ativar minha conta
        </Button>
      </Section>
      <Text className="text-sm text-slate-500">
        Este link vale por {ACTIVATION_LINK_TTL_MINUTES} minutos e pode ser usado apenas uma vez. Se
        você não solicitou este cadastro, ignore esta mensagem.
      </Text>
    </EmailLayout>
  )
}
