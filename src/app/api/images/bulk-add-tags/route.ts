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

  const { imageIds, tags, tagsToRemove } = await req.json();

  if (!Array.isArray(imageIds) || !Array.isArray(tags)) {
    return new NextResponse('Invalid input', { status: 400 });
  }

  // Normalize and deduplicate
  const tagNames = tags.map((tag) => tag.name.trim().toLowerCase());
  const uniqueTagNames = [...new Set(tagNames)];

  // 1. Find existing tags by name
  const existingTags = await prisma.tag.findMany({
    where: {
      userId: user.id,
      name: { in: uniqueTagNames },
    },
  });

  const existingTagNames = new Set(
    existingTags.map((t) => t.name.toLowerCase()),
  );
  const newTagNames = uniqueTagNames.filter(
    (name) => !existingTagNames.has(name),
  );

  // 2. Create any new tags
  const createdTags = await prisma.$transaction(
    newTagNames.map((name) =>
      prisma.tag.create({
        data: { name, userId: user.id },
      }),
    ),
  );

  const allTagsToAdd = [...existingTags, ...createdTags];

  // 3. Create ImageTag links (ignore duplicates)
  const addImageTagOps = imageIds.flatMap((imageId) =>
    allTagsToAdd.map((tag) =>
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
  );

  // 4. Remove ImageTag links
  const removeImageTagOps =
    Array.isArray(tagsToRemove) && tagsToRemove.length > 0
      ? [
          prisma.imageTag.deleteMany({
            where: {
              imageId: { in: imageIds },
              tagId: { in: tagsToRemove },
            },
          }),
        ]
      : [];

  // 5. Execute all operations
  await prisma.$transaction([...addImageTagOps, ...removeImageTagOps]);

  return NextResponse.json({ success: true });
}
