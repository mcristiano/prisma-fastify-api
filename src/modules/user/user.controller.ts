import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput } from './user.schema';
import { createUser } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body

  console.log(body);

  try {
    const user = await createUser(body)

    return reply.code(201).send(user);
  } catch (e) {
    console.error(e);
    // TODO check what the error actually was and send back a different error depending on that
    return reply.code(500).send(e);
  }
}
