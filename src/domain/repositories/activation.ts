import { type Activation } from '@domain/entities/activation'

export interface ActivationRepository {
  create(activation: Activation): Promise<void>
  findByTokenHash(tokenHash: string): Promise<Activation | null>
  update(activation: Activation): Promise<void>
}
