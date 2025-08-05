'use client';

import userAtom from '@/lib/atoms/userAtom';
import { useAtomValue } from 'jotai';
import AvatarDropdown from '../AvatarDropdown';

export default function HeaderBar() {
  const user = useAtomValue(userAtom);

  return (
    <div className="fixed flex h-12 w-full items-center justify-end bg-foreground px-4">
      {!user && <span>Sign in</span>}
      {user && <AvatarDropdown />}
    </div>
  );
}
