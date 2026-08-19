import { type StatusCode } from '@common/http/statuses'

export type HTTPRequest = Readonly<{
  body: unknown
  params: unknown
  query: unknown
}>

export type HTTPResponse = Readonly<{
  body?: unknown
  status: StatusCode
}>

export interface Controller {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
