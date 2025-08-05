import ReferenceManager from '@/components/ReferenceManager';
import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ReferencesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="h-screen pt-12">
      <main className="overflow-y-auto">
        <ReferenceManager />
      </main>
    </div>
  );
}
