export interface Transaction {
  run<T>(handler: () => Promise<T>): Promise<T>
}
