import { faker } from '@faker-js/faker'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64
const JSON_HEADERS = { 'Content-Type': 'application/json' }

export type SignUpInput = Readonly<{
  email: string
  firstName: string
  lastName: string
  password: string
}>

export type RequestResult = Readonly<{
  body: string
  status: number
}>

export type SignUpResult = RequestResult & Readonly<{ input: SignUpInput }>

export function buildSignUpInput(overrides: Partial<SignUpInput> = {}): SignUpInput {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({
      length: faker.number.int({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
    }),
    ...overrides
  }
}

export async function requestSignUp(
  address: string,
  overrides: Partial<SignUpInput> = {}
): Promise<SignUpResult> {
  const input = buildSignUpInput(overrides)
  const result = await postJSON(
    `${address}/v1/users`,
    JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      password: input.password
    })
  )

  return { ...result, input }
}

export async function requestRawSignUp(address: string, body: string): Promise<RequestResult> {
  return postJSON(`${address}/v1/users`, body)
}

export async function requestActivation(address: string, token: string): Promise<RequestResult> {
  return postJSON(`${address}/v1/users/activations`, JSON.stringify({ token }))
}

export async function requestRawActivation(address: string, body: string): Promise<RequestResult> {
  return postJSON(`${address}/v1/users/activations`, body)
}

async function postJSON(url: string, body: string): Promise<RequestResult> {
  const response = await fetch(url, { body, headers: JSON_HEADERS, method: 'POST' })

  return { body: await response.text(), status: response.status }
}

export function aliasOf(email: string): string {
  const [local, domain] = email.toLowerCase().split('@')

  return `${local}+${faker.word.sample()}@${domain}`
}

export function mixCase(value: string): string {
  return value
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('')
}
