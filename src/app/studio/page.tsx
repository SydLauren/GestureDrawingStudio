import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import ImageUploadPanel from '@/components/ImageUploadPanel';
import { syncUserServer } from '@/lib/db/server/syncUser';
import ImageGallery from '@/components/ImageGallery';
import SessionSetupPanel from '@/components/SessionSetupPanel';

export default async function StudioPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  // ✅ Sync user to Prisma
  await syncUserServer({ id: user.id, email: user.email! });

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar user={user} />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome to your studio</h1>
          <p className="mt-2 text-muted-foreground">
            Upload and manage your image library below.
          </p>
        </div>
        <SessionSetupPanel />
        <ImageUploadPanel userId={user.id} />
        <ImageGallery />
      </main>
    </div>
  );
}
