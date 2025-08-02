import { useQuery } from '@tanstack/react-query';
import type { Prisma } from '@prisma/client';

export type ImageWithTags = Prisma.ImageGetPayload<{
  include: {
    imageTags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export function useUserImages() {
  return useQuery<ImageWithTags[]>({
    queryKey: ['user-images'],
    queryFn: async () => {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Failed to load images');
      return res.json() as Promise<ImageWithTags[]>;
    },
  });
}
