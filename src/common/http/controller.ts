import { type StatusCode } from '@common/http/statuses'

export type HTTPRequest = Readonly<{
  body?: unknown
  query?: unknown
  params?: unknown
}>

export type HTTPResponse = Readonly<{
  body?: unknown
  status: StatusCode
}>

export interface HTTPController {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
