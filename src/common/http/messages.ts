import { type StatusCode } from '@common/http/statuses'

export type HttpRequest = Readonly<{
  body: unknown
}>

export type HttpResponse = Readonly<{
  body?: unknown
  status: StatusCode
}>
