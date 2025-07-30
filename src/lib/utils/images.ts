export const constructImageUrlFromPath = (path: string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-images/${path}`;
};
