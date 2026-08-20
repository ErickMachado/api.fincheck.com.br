import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type Controller } from '@common/http/controller'

export function adapt(controller: Controller) {
  return async function handler(request: FastifyRequest, reply: FastifyReply) {
    const response = await controller.handle({
      body: request.body,
      params: request.params,
      query: request.query
    })

    reply.code(response.status)

    if (response.body === undefined) {
      return reply.send()
    }

    return reply.send(response.body)
  }
}
