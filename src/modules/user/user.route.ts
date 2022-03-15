import { FastifyInstance } from 'fastify';
import { loginUserHandler, registerUserHandler, getAllUsersHandler } from './user.controller';
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

  server.get('/', {
    // in other routes we define what we want returned inside of our schema
    // here for the sake of demonstration we're defining it in the controller

    // preHandler gets called before any async stuff
    preHandler: [server.authenticate]

  }, getAllUsersHandler);
}

export default userRoutes;
