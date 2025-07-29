// hooks/useUser.ts
'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return user;
}
