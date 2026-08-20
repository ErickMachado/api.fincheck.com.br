import { z } from 'zod'

const CONFIG_SCHEMA = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging', 'test']),
  APP_HOST: z.ipv4({ error: 'Must be a valid IPv4 address' }),
  APP_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  APP_WEB_URL: z.url({ error: 'Must be a valid URL' }),
  MAIL_FROM_ADDRESS: z.email({ error: 'Must be a valid email address' }),
  MAIL_FROM_NAME: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  POSTGRES_SSL: z.stringbool(),
  POSTGRES_USER: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  RABBITMQ_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  RABBITMQ_USER: z.string(),
  RABBITMQ_VHOST: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  SMTP_SECURE: z.stringbool(),
  SMTP_USER: z.string()
})

type ConfigValues = z.infer<typeof CONFIG_SCHEMA>

export class Configuration {
  private constructor(private readonly values: ConfigValues) {}

  public get app() {
    return {
      env: this.values.APP_ENV,
      host: this.values.APP_HOST,
      port: this.values.APP_PORT,
      webUrl: this.values.APP_WEB_URL
    }
  }

  public get mail() {
    return {
      fromAddress: this.values.MAIL_FROM_ADDRESS,
      fromName: this.values.MAIL_FROM_NAME
    }
  }

  public get postgres() {
    return {
      database: this.values.POSTGRES_DATABASE,
      host: this.values.POSTGRES_HOST,
      password: this.values.POSTGRES_PASSWORD,
      port: this.values.POSTGRES_PORT,
      ssl: this.values.POSTGRES_SSL,
      user: this.values.POSTGRES_USER
    }
  }

  public get rabbitmq() {
    return {
      host: this.values.RABBITMQ_HOST,
      password: this.values.RABBITMQ_PASSWORD,
      port: this.values.RABBITMQ_PORT,
      user: this.values.RABBITMQ_USER,
      vhost: this.values.RABBITMQ_VHOST
    }
  }

  public get smtp() {
    return {
      host: this.values.SMTP_HOST,
      password: this.values.SMTP_PASSWORD,
      port: this.values.SMTP_PORT,
      secure: this.values.SMTP_SECURE,
      user: this.values.SMTP_USER
    }
  }

  public static async from(value: NodeJS.ProcessEnv): Promise<Configuration> {
    const values = await CONFIG_SCHEMA.parseAsync(value)

    return new Configuration(values)
  }
}
