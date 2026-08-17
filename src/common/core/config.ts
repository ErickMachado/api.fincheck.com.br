import { z } from 'zod'

const CONFIG_SCHEMA = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging', 'test']),
  APP_HOST: z.ipv4({ error: 'Must be a valid IPv4 address' }),
  APP_PORT: z.coerce.number({ error: 'Must be a number greater or equal to 0' }),
  DATABASE_URL: z.url({ error: 'Must be a valid URL' })
})

type ConfigValues = z.infer<typeof CONFIG_SCHEMA>

export class Configuration {
  private constructor(private readonly values: ConfigValues) {}

  public get app() {
    return {
      env: this.values.APP_ENV,
      host: this.values.APP_HOST,
      port: this.values.APP_PORT
    }
  }

  public get database() {
    return {
      url: this.values.DATABASE_URL
    }
  }

  public static async from(value: NodeJS.ProcessEnv): Promise<Configuration> {
    const values = await CONFIG_SCHEMA.parseAsync(value)

    return new Configuration(values)
  }
}
