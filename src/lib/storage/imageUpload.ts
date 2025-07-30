import { createBrowserSupabase } from '@/lib/supabase/browser';
import { sanitizeFilename } from '../utils/sanitizers';

export async function uploadImage(file: File, userId: string) {
  const supabase = createBrowserSupabase();

  const safeName = sanitizeFilename(file.name);
  const filePath = `${userId}/${Date.now()}-${safeName}`;

  console.log('🚀 ~ uploadImage ~ filePath:', filePath);
  const { data, error } = await supabase.storage
    .from('user-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  console.log('🚀 ~ uploadImage ~ data:', data);
  return {
    path: data.path,
    fullPath: `user-images/${data.path}`,
  };
}
