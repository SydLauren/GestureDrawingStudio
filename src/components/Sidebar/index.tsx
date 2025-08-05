// components/sidebar.tsx
'use client';

import { Button } from '@/components/ui/button';
import userAtom from '@/lib/atoms/userAtom';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

type Props = {
  user: User;
};

export default function Sidebar({ user }: Props) {
  const setUser = useSetAtom(userAtom);
  const supabase = createBrowserSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    setUser(user);
  });

  return (
    <aside className="flex h-20 w-full items-center justify-between gap-2 bg-muted p-4 md:h-full md:w-64 md:flex-col md:items-start">
      <Button
        variant="outline"
        size="sm"
        className="whitespace-nowrap"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </aside>
  );
}
