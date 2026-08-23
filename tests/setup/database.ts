import { type Orchestrator } from '@tests/setup/orchestrator'

const COUNT_ALL_USERS_SQL = 'SELECT COUNT(*)::int AS count FROM users'
const COUNT_USERS_BY_EMAIL_SQL = `${COUNT_ALL_USERS_SQL} WHERE email = $1`
const COUNT_ACTIVATIONS_SQL = `SELECT COUNT(*)::int AS count FROM user_activation_tokens
  WHERE user_fk = (SELECT id FROM users WHERE email = $1)`

export async function countUsers(orchestrator: Orchestrator, email?: string): Promise<number> {
  const [row] = await orchestrator.query<{ count: number }>(
    email ? COUNT_USERS_BY_EMAIL_SQL : COUNT_ALL_USERS_SQL,
    email ? [email.toLowerCase()] : []
  )

  return row.count
}

export async function countActivations(orchestrator: Orchestrator, email: string): Promise<number> {
  const [row] = await orchestrator.query<{ count: number }>(COUNT_ACTIVATIONS_SQL, [
    email.toLowerCase()
  ])

  return row.count
}

export async function storedEmail(orchestrator: Orchestrator, email: string): Promise<string> {
  const [user] = await orchestrator.query<{ email: string }>(
    'SELECT email FROM users WHERE email = $1',
    [email.toLowerCase()]
  )

  return user.email
}

export async function isActivated(orchestrator: Orchestrator, email: string): Promise<boolean> {
  const [user] = await orchestrator.query<{ is_activated: boolean }>(
    'SELECT is_activated FROM users WHERE email = $1',
    [email.toLowerCase()]
  )

  return user.is_activated
}

export async function orphanActivation(orchestrator: Orchestrator, email: string): Promise<void> {
  await orchestrator.query('ALTER TABLE users DISABLE TRIGGER ALL')

  try {
    await orchestrator.query('DELETE FROM users WHERE email = $1', [email.toLowerCase()])
  } finally {
    await orchestrator.query('ALTER TABLE users ENABLE TRIGGER ALL')
  }
}
