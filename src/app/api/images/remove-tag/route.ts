// src/app/api/images/remove-tag/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { imageId, tagId } = await req.json();

  if (!imageId || !tagId) {
    return new NextResponse('Missing imageId or tagId', { status: 400 });
  }

  // Ensure the image belongs to the user
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      userId: user.id,
    },
  });

  if (!image) {
    return new NextResponse('Image not found', { status: 404 });
  }

  // Remove the tag association
  const result = await prisma.imageTag.deleteMany({
    where: {
      imageId,
      tagId,
    },
  });

  if (result.count === 0) {
    return new NextResponse('Tag not found on image', { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
