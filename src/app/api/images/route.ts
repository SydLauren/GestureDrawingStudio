import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiSupabase } from '@/lib/supabase/api';
import { Image, Prisma } from '@prisma/client';

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

export async function GET(
  req: Request,
): Promise<NextResponse<Image[] | string>> {
  const cookieStore = await cookies();
  const supabase = createApiSupabase(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const tagIdsParam = searchParams.get('tagIds');
  const tagIds = tagIdsParam ? tagIdsParam.split(',') : [];

  // Build the where clause
  const whereClause: Prisma.ImageWhereInput = { userId: user.id };

  if (tagIds.length > 0) {
    whereClause.imageTags = {
      some: {
        tagId: {
          in: tagIds,
        },
      },
    };
  }

  const images = await prisma.image.findMany({
    where: whereClause,
    include: {
      imageTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(images);
}
