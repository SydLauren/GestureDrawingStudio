import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiSupabase } from '@/lib/supabase/api';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, path, name } = body;

  try {
    const image = await prisma.image.create({
      data: {
        userId,
        path,
        name,
      },
    });
    return NextResponse.json(image);
  } catch (err) {
    console.error('[IMAGE CREATE ERROR]', err);
    return new NextResponse('Server error', { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createApiSupabase(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const images = await prisma.image.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(images);
}
