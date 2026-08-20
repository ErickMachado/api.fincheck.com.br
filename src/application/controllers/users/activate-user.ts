import { z } from 'zod'
import { type ActivateUser } from '@application/usecases/auth/activate-user'
import { type Controller, type HTTPRequest, type HTTPResponse } from '@common/http/controller'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'

const TOKEN_MIN_LENGTH = 1

const BODY_SCHEMA = z.object({
  token: z.string().min(TOKEN_MIN_LENGTH)
})

export class ActivateUserController implements Controller {
  public constructor(private readonly activateUser: ActivateUser) {}

  public async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const result = BODY_SCHEMA.safeParse(request.body)

    if (!result.success) throw Problem.fromZod(result.error)

    await this.activateUser.execute({ token: result.data.token })

    return { status: StatusCode.NoContent }
  }
}
