import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from 'fastify-jwt';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

export const server = Fastify();

server.register(fjwt, {
  // FIXME: get something from env instead
  secret: 'sdlkfgjalsdgkjaldkjasdlbfasdfjkl',
});

// adding authenticate to our server so we have it on all routes
// might be better to define this in a types file or something
declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

// wherever we use the 'authenticate' decorator, this function is run
// like express middleware
server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch(e) {
    return reply.send(e);
  }
})

server.get('/healthcheck', async function () {
  return { status: 'OK' };
});

async function main() {
  // need to add schema before registering routes
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: 'api/user' });

  try {
    // docker doesn't have localhost
    await server.listen(3000, '0.0.0.0');
    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
