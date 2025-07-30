// lib/db/hooks/useCreateImage.ts
import { useMutation } from '@tanstack/react-query';

type CreateImageInput = {
  userId: string;
  path: string;
  name: string;
};

export function useCreateImage() {
  return useMutation({
    mutationFn: async ({ userId, path, name }: CreateImageInput) => {
      const res = await fetch('/api/images', {
        method: 'POST',
        body: JSON.stringify({ userId, path, name }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to create image record');
      }

      return await res.json();
    },
  });
}
