// /lib/db/hooks/useDeleteImage.ts
import Qkey from '@/lib/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Qkey.UserImages] });
    },
  });
}
