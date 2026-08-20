import { type Activation } from '@domain/entities/activation'

export interface ActivationRepository {
  create(activation: Activation): Promise<void>
  /**
   * Locks the found row until the end of the transaction, preventing the
   * same token from being consumed concurrently.
   */
  findByTokenHash(tokenHash: string): Promise<Activation | null>
  update(activation: Activation): Promise<void>
}
