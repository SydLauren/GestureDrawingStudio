// lib/db/images.ts
import { prisma } from '@/lib/prisma';

export async function createImageRecord({
  userId,
  path,
  name,
}: {
  userId: string;
  path: string;
  name: string;
}) {
  return prisma.image.create({
    data: {
      userId,
      path,
      name,
    },
  });
}
