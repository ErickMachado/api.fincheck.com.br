export type Task = () => Promise<void>

export interface Transaction {
  begin: (task: Task) => Promise<void>
}
