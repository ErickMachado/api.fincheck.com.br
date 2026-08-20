import { type StatusCode } from '@common/http/statuses'

export type HTTPRequest = {
  body: unknown
  params: unknown
  query: unknown
}

export type HTTPResponse = {
  body?: unknown
  status: StatusCode
}

export interface Controller {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
