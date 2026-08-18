import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { type CreateUserController } from '@application/controllers/user/create-user'
import { type HttpRequest, type HttpResponse } from '@common/http/messages'

interface Controller {
  handle(request: HttpRequest): Promise<HttpResponse>
}

export type Controllers = Readonly<{
  createUser: CreateUserController
}>

function adapt(controller: Controller) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const response = await controller.handle({ body: request.body })

    return reply.code(response.status).send(response.body)
  }
}

export function router(controllers: Controllers) {
  return async (app: FastifyInstance): Promise<void> => {
    app.post('/v1/users', adapt(controllers.createUser))
  }
}
