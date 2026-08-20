import { type FastifyInstance } from 'fastify'
import { ActivateUserController } from '@application/controllers/users/activate-user'
import { CreateUserController } from '@application/controllers/users/create-user'
import { type ActivateUser } from '@application/usecases/auth/activate-user'
import { type CreateUser } from '@application/usecases/auth/create-user'
import { adapt } from '@main/adapters/controller'

export type Usecases = Readonly<{
  activateUser: ActivateUser
  createUser: CreateUser
}>

export function registerRoutes(app: FastifyInstance, usecases: Usecases): void {
  app.post('/v1/users', adapt(new CreateUserController(usecases.createUser)))
  app.post('/v1/users/activations', adapt(new ActivateUserController(usecases.activateUser)))
}
