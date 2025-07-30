import { prisma } from '@/lib/prisma';

export async function syncUserServer(user: {
  id: string;
  email: string | null;
}) {
  if (!user?.id) return;

  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email ?? undefined },
    create: {
      id: user.id,
      email: user.email ?? '',
    },
  });
}
