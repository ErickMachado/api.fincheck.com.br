import { ActivateUser } from '@application/usecases/auth/activate-user'
import { CreateUser } from '@application/usecases/auth/create-user'
import { type MessagingDependencies } from '@main/factories/messaging'
import { type PersistenceDependencies } from '@main/factories/persistence'
import { type Usecases } from '@main/router'

export function createUsecases(
  persistence: PersistenceDependencies,
  messaging: MessagingDependencies
): Usecases {
  return {
    activateUser: new ActivateUser({
      activationRepository: persistence.activationRepository,
      transaction: persistence.transaction,
      userRepository: persistence.userRepository
    }),
    createUser: new CreateUser({
      activationRepository: persistence.activationRepository,
      mailer: messaging.mailer,
      passwordHasher: persistence.passwordHasher,
      transaction: persistence.transaction,
      userRepository: persistence.userRepository
    })
  }
}
