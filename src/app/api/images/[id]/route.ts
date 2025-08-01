// /app/api/images/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createServerSupabase();
  const { id } = params;

  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) return new NextResponse('Not found', { status: 404 });

  // Delete from Supabase Storage
  await supabase.storage.from('user-images').remove([image.path]);

  // Delete from DB
  await prisma.image.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
