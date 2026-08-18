import { z } from 'zod'
import { type CreateUser } from '@application/usecases/user/create-user'
import { type HttpRequest, type HttpResponse } from '@common/http/messages'
import { StatusCode } from '@common/http/statuses'

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 50
const EMAIL_MAX_LENGTH = 254
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

const nameSchema = z.string().trim().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH)

export const createUserSchema = z.object({
  email: z.string().trim().pipe(z.email().max(EMAIL_MAX_LENGTH)),
  first_name: nameSchema,
  last_name: nameSchema,
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH)
})

export class CreateUserController {
  public constructor(private readonly createUser: CreateUser) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const body = createUserSchema.parse(request.body)

    await this.createUser.execute({
      email: body.email,
      firstName: body.first_name,
      lastName: body.last_name,
      password: body.password
    })

    return { status: StatusCode.NoContent }
  }
}
