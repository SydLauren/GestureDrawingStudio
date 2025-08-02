import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { label } = body;

  if (typeof label !== 'string' || !label.trim()) {
    return new NextResponse('Invalid label', { status: 400 });
  }

  const tag = await prisma.tag.create({
    data: {
      name: label.trim(),
      userId: user.id,
    },
  });

  return NextResponse.json(tag);
}
