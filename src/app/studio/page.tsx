// app/studio/page.tsx
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';

export default async function StudioPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <h1 className="text-xl font-bold md:text-2xl">
          Welcome to your studio
        </h1>
        <p className="mt-2 text-muted-foreground">More features coming soon.</p>
      </main>
    </div>
  );
}
