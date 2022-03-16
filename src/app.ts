import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from 'fastify-jwt';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';

export const server = Fastify();

// adding authenticate to our server so we have it on all routes
// might be better to define this in a types file or something
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module 'fastify-jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

server.register(fjwt, {
  // FIXME: get something from env instead
  secret: 'sdlkfgjalsdgkjaldkjasdlbfasdfjkl',
});

// wherever we use the 'authenticate' decorator, this function is run
// like express middleware
server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.get('/healthcheck', async function () {
  return { status: 'OK' };
});

async function main() {
  // need to add schema before registering routes
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products'})

  try {
    // 0.0.0.0 listens on all ports
    const port = process.env.PORT || 3000;
    await server.listen(port, '0.0.0.0');
    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
