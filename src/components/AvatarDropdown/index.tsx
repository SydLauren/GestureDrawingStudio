'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import userAtom from '@/lib/atoms/userAtom';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAtomValue } from 'jotai';
import Flex from '../ui/Flex';
interface Props {
  onSignOut: () => void;
}

export default function AvatarDropdown({ onSignOut }: Props) {
  const user = useAtomValue(userAtom);
  const avatarUrl = user?.user_metadata.avatar_url;
  const name = user?.user_metadata.full_name || user?.email || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Flex>
          <Avatar className="h-10 w-10 border border-white md:h-8 md:w-8">
            <AvatarImage src={avatarUrl} alt="User avatar" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onSignOut}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
