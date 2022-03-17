import { test } from 'tap';
import buildServer from '../server';

test('requests `/healthcheck` route', async (t) => {
  const fastify = buildServer();

  // tear down server after test finishes running
  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: 'GET',
    url: '/healthcheck',
  });

  t.equal(response.statusCode, 200, 'Response status code from /healthcheck');
  t.same(
    response.json(),
    { status: 'OK' },
    'Response status json from /healthcheck'
  );
});
