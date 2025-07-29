// middleware.ts
import { createMiddlewareSupabase } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabase(request);
  await supabase.auth.getUser(); // ✅ this ensures cookies are updated

  // Optional: redirect to login if user isn't authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');

  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // protect all routes except static assets
  ],
};
