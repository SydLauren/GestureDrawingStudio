// components/LoginButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/login')}
      className="rounded-md px-6 py-3 text-lg"
    >
      Login / Sign Up
    </Button>
  );
}
