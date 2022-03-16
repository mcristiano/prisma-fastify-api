# initialize yarn
yarn init

# initialize typescript
npx --package typescript tsc --init

# install packages
yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

# install development packages
yarn add -D ts-node-dev typescript @types/node

# initialize prisma
npx prisma init --datasource-provider postgresql

# migrate the schema
npx prisma migrate dev --name init