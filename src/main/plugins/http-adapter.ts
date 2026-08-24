import { type FastifyRequest, type FastifyReply } from 'fastify'
import { type HTTPController } from '@common/http/controller'

export class HTTPAdapter {
  public static fastify(handler: HTTPController) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const { body, status } = await handler.handle({
        body: request.body
      })

      return reply.code(status).send(body)
    }
  }
}
