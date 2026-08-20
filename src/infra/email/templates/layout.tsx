import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import { type ReactNode } from 'react'

const BRAND_NAME = 'Fincheck'
const UNMONITORED_MAILBOX_NOTICE =
  'Esta é uma mensagem automática. Não responda a este e-mail: a caixa não é monitorada.'

type EmailLayoutProps = {
  children: ReactNode
  preview: string
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-slate-100 py-10 font-sans">
          <Container className="mx-auto max-w-lg rounded-lg bg-white px-8 py-10">
            <Section>
              <Text className="text-xl font-bold text-slate-900">{BRAND_NAME}</Text>
            </Section>
            <Section>{children}</Section>
            <Hr className="my-8 border-slate-200" />
            <Section>
              <Text className="text-xs text-slate-400">{UNMONITORED_MAILBOX_NOTICE}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
