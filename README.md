# Prisma Fastify API

## What is this?
A basic CRUD API created with Postgres/Prisma and Fastify, plus Zod and Fastify-Zod for schema validation and automatic swagger docs.

## What is the purpose?
I hadn't used Prisma or Fastify before so I wanted to try both.

## What are the conclusions?
Prisma is great, and other than the benefit of easily hosting databases for free on MongoDB Atlas I don't think there are many situations where I wouldn't use Prisma/Postgres over Mongoose/Mongo.

Fastify is also quite nice, with some great benefits over Express such as:
- Much easier to define types for Request and Response/Reply
- Better Zod integration
- Create swagger docs for free with fastify-zod
- Significantly better performance (about 4x)

The main downside of Fastify is that it has WAY fewer users than Express, which means fewer people who will have run into the same bugs, so I think for many types of projects I would continue to use Express for the time being.

Also for Next.js projects, it is currently possible to [use Next.js SSR with Fastify](https://github.com/fastify/fastify-nextjs), but not to replace Next.js's internal Express server with Fastify.
