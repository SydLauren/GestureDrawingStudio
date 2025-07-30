import { createBrowserSupabase } from './browser';

export async function getSignedImageUrl(path: string) {
  const supabase = createBrowserSupabase();

  const { data, error } = await supabase.storage
    .from('user-images')
    .createSignedUrl(path, 60 * 60); // valid for 1 hour

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data?.signedUrl || null;
}
