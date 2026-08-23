export function pointersOf(body: string): string[] {
  const problem = JSON.parse(body) as { errors: Array<{ pointer: string }> }

  return problem.errors.map((error) => error.pointer)
}
