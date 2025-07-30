import { useQuery } from '@tanstack/react-query';
import type { Image } from '@prisma/client';

export function useUserImages() {
  return useQuery<Image[]>({
    queryKey: ['user-images'],
    queryFn: async () => {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Failed to load images');
      return res.json() as Promise<Image[]>;
    },
  });
}
