import { type ZodError } from 'zod'
import { StatusCode } from '@common/http/statuses'

type Details = Readonly<{
  title: string
  detail: string
  status: StatusCode
}>

export class Problem extends Error {
  private readonly title: string
  private readonly detail: string
  public readonly status: StatusCode
  private readonly errors: Map<string, string>
  private instance?: string

  private constructor(details: Details) {
    super()

    this.name = 'Problem'
    this.title = details.title
    this.detail = details.detail
    this.status = details.status
    this.errors = new Map()
  }

  public setInstance(value: string): void {
    this.instance = value
  }

  public serialize() {
    const errors = [...this.errors.entries()].map(([pointer, detail]) => ({
      detail,
      pointer
    }))

    return {
      title: this.title,
      detail: this.detail,
      instance: this.instance,
      ...(errors.length > 0 ? { errors } : {})
    }
  }

  public static fromZod(error: ZodError): Problem {
    const problem = new Problem({
      title: 'Request validation failed',
      detail: 'One or more fields in the request are invalid',
      status: StatusCode.BadRequest
    })

    for (const issue of error.issues) {
      problem.addError(issue)
    }

    return problem
  }

  public static internal(): Problem {
    return new Problem({
      title: 'Internal Server Error',
      detail: 'An unknown error prevented the server from responding your request',
      status: StatusCode.InternalServerError
    })
  }

  private addError(error: ZodError['issues'][number]): void {
    let key = error.path.join('/')

    if (key === '') {
      key = '#'
    } else {
      key = `#/${key}`
    }

    if (this.errors.has(key)) return

    this.errors.set(key, error.message)
  }
}
