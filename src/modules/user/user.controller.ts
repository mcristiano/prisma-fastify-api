import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyPassword } from '../../utils/hash';
import { CreateUserInput, LoginUserInput } from './user.schema';
import { createUser, findUserByEmail, findUsers } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body

  // even if we send additional stuff in the request, it won't be on the
  // object thanks to fastify-zod
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

export async function loginUserHandler(request: FastifyRequest<{
 Body: LoginUserInput;
}>, reply: FastifyReply) {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    })
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  })

  // generate access token
  if (correctPassword) {
    const {password, salt, ...rest} = user;

    return { accessToken: request.jwt.sign(rest) };
  }

  // respond
  return reply.code(401).send({
    message: 'Invalid email or password',
  })
}

export async function getAllUsersHandler() {
  const users = await findUsers();

  return users;
}
