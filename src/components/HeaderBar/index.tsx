'use client';

import AvatarDropdown from '../AvatarDropdown';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { useUser } from '@/hooks/useUser';

export default function HeaderBar() {
  const user = useUser();
  const supabase = createBrowserSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="fixed flex h-12 w-full items-center justify-end bg-foreground px-4">
      {!user && <span>Sign in</span>}
      {user && <AvatarDropdown onSignOut={handleSignOut} />}
    </div>
  );
}
