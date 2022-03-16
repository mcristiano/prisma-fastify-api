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
      createdAt: true,
      updatedAt: true,
      owner: true,
    },
  });
}
