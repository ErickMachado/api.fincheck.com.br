import { z } from 'zod'

const stringBoolean = z
  .enum(['false', 'true'], { error: 'Must be "true" or "false"' })
  .transform((value) => value === 'true')

const CONFIG_SCHEMA = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging', 'test']),
  APP_HOST: z.ipv4({ error: 'Must be a valid IPv4 address' }),
  APP_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  APP_WEB_URL: z.url({ error: 'Must be a valid URL' }),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  POSTGRES_SSL: stringBoolean,
  POSTGRES_USER: z.string().min(1),
  SMTP_FROM_ADDRESS: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PASSWORD: z.string(),
  SMTP_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  SMTP_SECURE: stringBoolean,
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
      webURL: this.values.APP_WEB_URL
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

  public get smtp() {
    return {
      fromAddress: this.values.SMTP_FROM_ADDRESS,
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
