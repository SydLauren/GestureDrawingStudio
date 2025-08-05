// hooks/useUser.ts
'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';
import { useSetAtom } from 'jotai';
import userAtom from '@/lib/atoms/userAtom';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const setUserAtom = useSetAtom(userAtom);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setUserAtom(user);
    }
  }, [user, setUserAtom]);

  return user;
}
