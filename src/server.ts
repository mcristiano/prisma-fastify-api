import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt, { JWT } from 'fastify-jwt';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';
import swagger from 'fastify-swagger';
import { withRefResolver } from 'fastify-zod';
import { version } from '../package.json';

// adding authenticate to our server so we have it on all routes
// might be better to define this in a types file or something
declare module 'fastify' {
  // lets us put the JWT on the request
  interface FastifyRequest {
    jwt: JWT
  }

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

function buildServer() {
  const server = Fastify();

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

  server.addHook("preHandler", (req: FastifyRequest, reply, next) => {
    req.jwt = server.jwt;
    return next();
  })

  // need to add schema before registering routes
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true, // content security policy headers
      openapi: {
        info: {
          title: 'Fastify API',
          description: 'API for some products',
          version,
        },
      },
    })
  );

  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products' });

  return server;
}

export default buildServer;
