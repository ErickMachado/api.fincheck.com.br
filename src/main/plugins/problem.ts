import { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { Problem } from '@common/http/problem'
import { StatusCode } from '@common/http/statuses'

export function problem(error: Error, request: FastifyRequest, reply: FastifyReply) {
  const response = toProblem(error)

  response.setInstance(request.url)

  return reply.code(response.status).send(response.serialize())
}

function toProblem(error: Error): Problem {
  if (error instanceof Problem) return error

  /* v8 ignore next -- controllers already convert validation failures into `Problem` before throwing; a raw `ZodError` never reaches here */
  if (error instanceof ZodError) return Problem.fromZod(error)

  if ((error as FastifyError).statusCode === StatusCode.BadRequest) return Problem.badRequest()

  return Problem.internal()
}
