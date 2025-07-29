import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginButton from '@/components/LoginButton';

export default async function MarketingPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/studio'); // 👈 prevent signed-in users from seeing marketing page
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-6 text-4xl font-bold md:text-6xl">
        Gesture Drawing Studio
      </h1>
      <LoginButton />
    </main>
  );
}
