import { z } from 'zod'

const CONFIG_SCHEMA = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging', 'test']),
  APP_HOST: z.ipv4(),
  APP_PORT: z.coerce.number(),

  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_SSL: z.stringbool()
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

  public static async from(value: NodeJS.ProcessEnv): Promise<Configuration> {
    const values = await CONFIG_SCHEMA.parseAsync(value)

    return new Configuration(values)
  }
}
