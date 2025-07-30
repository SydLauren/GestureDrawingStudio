'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    const supabase = createBrowserSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(next);
      } else {
        router.replace('/login');
      }
    });
  }, [router, next]);

  return (
    <main className="p-8">
      <p>Finishing login…</p>
    </main>
  );
}
