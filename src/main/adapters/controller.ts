import { type FastifyRequest, type FastifyReply } from 'fastify'
import { type Controller } from '@common/http/controller'
import { StatusCode } from '@common/http/statuses'

export function adaptController(controller: Controller) {
  return async function handler(request: FastifyRequest, reply: FastifyReply) {
    const response = await controller.handle({
      body: request.body,
      params: request.params,
      query: request.query
    })

    if (response.status === StatusCode.NoContent) {
      return reply.code(response.status).send()
    }

    return reply.code(response.status).send(response.body)
  }
}
