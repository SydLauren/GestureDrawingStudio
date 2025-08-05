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
    <div className="h-screen px-2">
      <h1 className="text-4xl font-medium">Reference Library</h1>
      <p className="leading-7">
        {
          "Use this library to power your drawing sessions. Add relevant tags for each image you upload so that you can filter this library down to what's important to you in your drawing sessions"
        }
      </p>
      <main className="overflow-y-auto pt-8">
        <ReferenceManager />
      </main>
    </div>
  );
}
