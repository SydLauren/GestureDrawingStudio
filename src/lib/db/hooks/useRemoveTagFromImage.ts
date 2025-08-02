import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
export function useRemoveTagFromImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageId,
      tagId,
    }: {
      imageId: string;
      tagId: string;
    }) => {
      const res = await fetch('/api/images/remove-tag', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId, tagId }),
      });

      if (!res.ok) {
        throw new Error('Failed to remove tag');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-images'] });
      toast.success('Tag removed');
    },
    onError: () => {
      toast.error('Failed to remove tag');
    },
  });
}
