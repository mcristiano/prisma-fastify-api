import { triggerAsyncId } from 'async_hooks';
import { string } from 'zod';
import prisma from '../../utils/prisma';
import { CreateProductInput } from './product.schema';

// infer ownerId from JWT
export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return prisma.product.create({
    data,
  });
}

export function getProducts() {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}
