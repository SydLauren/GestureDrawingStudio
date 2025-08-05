import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { syncUserServer } from '@/lib/db/server/syncUser';
import SessionSetupPanel from '@/components/SessionSetupPanel';

export default async function SessionBuilderPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  // ✅ Sync user to Prisma
  await syncUserServer({ id: user.id, email: user.email! });

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to your studio</h1>
      <p className="mt-2 text-muted-foreground">
        Upload and manage your image library below.
      </p>
      <SessionSetupPanel />
    </div>
  );
}
