// app/api/images/bulk-add-tags/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiSupabase } from '@/lib/supabase/api';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createApiSupabase(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { imageIds, tags } = await req.json(); // e.g. ['abc', 'def'], ['pose', 'dynamic']

  if (!Array.isArray(imageIds) || !Array.isArray(tags)) {
    return new NextResponse('Invalid input', { status: 400 });
  }

  // 1. Find or create the tags for this user
  const existingTags = await prisma.tag.findMany({
    where: {
      userId: user.id,
      id: { in: tags.map((tag) => tag.id).filter(Boolean) },
    }, // handle undefined ids
  });

  const existingTagIds = new Set(existingTags.map((t) => t.id));
  const newTags = tags.filter((tag) => !existingTagIds.has(tag.id));

  const createdTags = await prisma.$transaction(
    newTags.map((tag) =>
      prisma.tag.create({
        data: { name: tag.name, userId: user.id },
      }),
    ),
  );
  console.log('🚀 ~ POST ~ createdTags:', createdTags);

  const allTags = [...existingTags, ...createdTags];
  console.log('Creating imageTag links for:', {
    imageIds,
    tagIds: allTags.map((t) => t.id),
  });

  // 2. Create ImageTag links (ignore duplicates)
  const result = await prisma.$transaction(
    imageIds.flatMap((imageId) =>
      allTags.map((tag) =>
        prisma.imageTag.upsert({
          where: {
            imageId_tagId: {
              imageId,
              tagId: tag.id,
            },
          },
          update: {}, // do nothing if exists
          create: {
            imageId,
            tagId: tag.id,
          },
        }),
      ),
    ),
  );
  console.log('🚀 ~ POST ~ result:', result);

  return NextResponse.json({ success: true });
}
