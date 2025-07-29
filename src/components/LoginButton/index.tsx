// components/LoginButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/login')}
      className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700"
    >
      Login / Sign Up
    </button>
  );
}
