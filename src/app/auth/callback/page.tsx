import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="p-8">Loading…</main>}>
      <CallbackClient />
    </Suspense>
  );
}
