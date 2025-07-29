// components/sidebar.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';

type Props = {
  user: User;
};

export default function Sidebar({ user }: Props) {
  const supabase = createBrowserSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const avatarUrl = user.user_metadata.avatar_url;
  const name = user.user_metadata.full_name || user.email || 'User';

  return (
    <aside className="flex h-20 w-full items-center justify-between gap-2 bg-muted p-4 md:h-full md:w-64 md:flex-col md:items-start">
      <div className="flex items-center gap-3 md:w-full md:flex-col md:gap-2">
        <Avatar className="h-10 w-10 md:h-16 md:w-16">
          <AvatarImage src={avatarUrl} alt="User avatar" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="max-w-[10rem] truncate text-sm text-muted-foreground md:text-center">
          {name}
        </p>
      </div>
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
