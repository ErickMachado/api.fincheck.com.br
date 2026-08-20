import { type Configuration } from '@common/core/config'
import { type PasswordHasher } from '@application/interfaces/password-hasher'
import { type Transaction } from '@application/interfaces/transaction'
import { type ActivationRepository } from '@domain/repositories/activation'
import { type UserRepository } from '@domain/repositories/user'
import { PostgresConnection } from '@infra/database/postgres/connection'
import { TransactionContext } from '@infra/database/postgres/context'
import { PostgresActivationRepository } from '@infra/database/postgres/repositories/activation'
import { PostgresUserRepository } from '@infra/database/postgres/repositories/user'
import { PostgresTransaction } from '@infra/database/postgres/transaction'
import { Argon2PasswordHasher } from '@infra/security/password-hasher'

export type PersistenceDependencies = Readonly<{
  activationRepository: ActivationRepository
  connection: PostgresConnection
  passwordHasher: PasswordHasher
  transaction: Transaction
  userRepository: UserRepository
}>

export function createPersistenceDependencies(config: Configuration): PersistenceDependencies {
  const connection = PostgresConnection.create(config)
  const context = TransactionContext.create(connection.pool)

  return {
    activationRepository: PostgresActivationRepository.create(context),
    connection,
    passwordHasher: new Argon2PasswordHasher(),
    transaction: PostgresTransaction.create(connection.pool, context),
    userRepository: PostgresUserRepository.create(context)
  }
}
