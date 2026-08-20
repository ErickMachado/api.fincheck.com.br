import { createElement } from 'react'
import { render } from '@react-email/components'
import { type Configuration } from '@common/core/config'
import { type ActivationMail } from '@application/interfaces/mailer'
import { EmailTransport } from '@infra/email/transport'
import { ACTIVATION_EMAIL_SUBJECT, ActivationEmail } from '@infra/email/templates/activation'
import { type EmailMessage } from '@infra/queue/messages'

type RenderedEmail = {
  html: string
  recipient: string
  subject: string
  text: string
}

export interface EmailDispatcher {
  dispatch(message: EmailMessage): Promise<void>
}

export class TemplateEmailDispatcher implements EmailDispatcher {
  public constructor(
    private readonly transport: EmailTransport,
    private readonly config: Pick<Configuration, 'app' | 'mail'>
  ) {}

  public async dispatch(message: EmailMessage): Promise<void> {
    const rendered = await this.render(message)

    await this.transport.send({
      from: `${this.config.mail.fromName} <${this.config.mail.fromAddress}>`,
      html: rendered.html,
      subject: rendered.subject,
      text: rendered.text,
      to: rendered.recipient
    })
  }

  private async render(message: EmailMessage): Promise<RenderedEmail> {
    switch (message.type) {
      case 'activation':
        return this.renderActivation(message.payload)
    }
  }

  private async renderActivation(payload: ActivationMail): Promise<RenderedEmail> {
    const element = createElement(ActivationEmail, {
      firstName: payload.firstName,
      token: payload.token,
      webUrl: this.config.app.webUrl
    })

    return {
      html: await render(element),
      recipient: payload.recipient,
      subject: ACTIVATION_EMAIL_SUBJECT,
      text: await render(element, { plainText: true })
    }
  }
}
