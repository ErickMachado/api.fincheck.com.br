import { type FastifyInstance } from 'fastify'
import { CreateUserController } from '@application/controllers/users/create-user'
import { type CreateUser } from '@application/usecases/auth/create-user'
import { adapt } from '@main/adapters/controller'

export type Usecases = Readonly<{
  createUser: CreateUser
}>

export function registerRoutes(app: FastifyInstance, usecases: Usecases): void {
  app.post('/v1/users', adapt(new CreateUserController(usecases.createUser)))
}
