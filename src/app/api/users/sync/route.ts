// app/api/users/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { id, email } = await req.json();

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { email },
      create: {
        id,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('[USER SYNC ERROR]', err);
    return new NextResponse('Error syncing user', { status: 500 });
  }
}
