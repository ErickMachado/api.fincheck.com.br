import { z } from 'zod'
import { type CreateUser } from '@application/usecases/auth/create-user'
import { type Controller, type HTTPRequest, type HTTPResponse } from '@common/http/controller'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'
import { EMAIL_MAX_LENGTH } from '@domain/value-objects/email'

const NAME_MIN_LENGTH = 1
const NAME_MAX_LENGTH = 100
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

const BODY_SCHEMA = z.object({
  email: z.string().trim().max(EMAIL_MAX_LENGTH).pipe(z.email()),
  first_name: z.string().trim().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  last_name: z.string().trim().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH)
})

export class CreateUserController implements Controller {
  public constructor(private readonly createUser: CreateUser) {}

  public async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const result = BODY_SCHEMA.safeParse(request.body)

    if (!result.success) throw Problem.fromZod(result.error)

    await this.createUser.execute({
      email: result.data.email,
      firstName: result.data.first_name,
      lastName: result.data.last_name,
      password: result.data.password
    })

    return { status: StatusCode.NoContent }
  }
}
