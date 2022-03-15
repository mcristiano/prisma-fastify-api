import { FastifyInstance } from 'fastify';
import { loginUserHandler, registerUserHandler } from './user.controller';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginUserSchema'),
        response: {
          200: $ref('loginUserResponseSchema'),
        },
      },
    },
    loginUserHandler
  );
}

export default userRoutes;
