import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { Problem } from '@common/http/problem'

export function problem(error: Error, request: FastifyRequest, reply: FastifyReply) {
  let response: Problem = null

  if (error instanceof ZodError) {
    response = Problem.fromZod(error)
  }

  if (error instanceof Problem && !response) {
    response = error
  }

  if (!response) {
    response = Problem.internal()
  }

  response.setInstance(request.url)

  return reply.code(response.status).send(response.serialize())
}
