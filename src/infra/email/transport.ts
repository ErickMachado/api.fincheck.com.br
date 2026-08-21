import nodemailer, { type SendMailOptions, type Transporter } from 'nodemailer'
import { type Configuration } from '@common/core/config'

export class EmailTransport {
  private constructor(private readonly transporter: Transporter) {}

  public async send(message: SendMailOptions): Promise<void> {
    await this.transporter.sendMail(message)
  }

  public close(): void {
    this.transporter.close()
  }

  public static create(config: Configuration['smtp']): EmailTransport {
    const transporter = nodemailer.createTransport({
      /* v8 ignore next -- MailCatcher, used in tests, does not support SMTP AUTH, so `config.user` is always empty */
      auth: config.user ? { pass: config.password, user: config.user } : undefined,
      host: config.host,
      pool: true,
      port: config.port,
      secure: config.secure
    })

    return new EmailTransport(transporter)
  }
}
