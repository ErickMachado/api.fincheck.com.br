import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { Problem } from '@common/http/problem'

export function problem(error: Error, request: FastifyRequest, reply: FastifyReply) {
  let response = Problem.internal()

  if (error instanceof ZodError) {
    response = Problem.fromZod(error)
  }

  response.setInstance(request.url)

  return reply.code(response.status).send(response.serialize())
}
