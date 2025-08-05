import { useQuery } from '@tanstack/react-query';
import type { Prisma } from '@prisma/client';
import Qkey from '@/lib/queryKeys';

export type ImageWithTags = Prisma.ImageGetPayload<{
  include: {
    imageTags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export interface ImageFilters {
  tagIds?: string[];
}

export function useUserImages(filters?: ImageFilters) {
  return useQuery<ImageWithTags[]>({
    queryKey: [Qkey.UserImages, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (filters?.tagIds && filters.tagIds.length > 0) {
        searchParams.append('tagIds', filters.tagIds.join(','));
      }

      const url = `/api/images${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load images');
      return res.json() as Promise<ImageWithTags[]>;
    },
  });
}
