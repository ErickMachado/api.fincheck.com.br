import { type FastifyRequest, type FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { Problem } from '@common/http/problem'

const MALFORMED_BODY_CODES = new Set([
  'FST_ERR_CTP_EMPTY_JSON_BODY',
  'FST_ERR_CTP_INVALID_CONTENT_LENGTH',
  'FST_ERR_CTP_INVALID_JSON_BODY',
  'FST_ERR_CTP_INVALID_MEDIA_TYPE'
])

function hasMalformedBody(error: Error): boolean {
  const code = (error as { code?: unknown }).code

  return typeof code === 'string' && MALFORMED_BODY_CODES.has(code)
}

export function problem(error: Error, request: FastifyRequest, reply: FastifyReply) {
  let response = Problem.internal()

  if (error instanceof Problem) {
    response = error
  } else if (error instanceof ZodError) {
    response = Problem.fromZod(error)
  } else if (hasMalformedBody(error)) {
    response = Problem.badRequest({
      title: 'Malformed request body',
      detail: 'The request body is absent or could not be parsed as JSON'
    })
  }

  response.setInstance(request.url)

  return reply.code(response.status).send(response.serialize())
}
