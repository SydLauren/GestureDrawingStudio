import { useQuery } from '@tanstack/react-query';

export function useUserImages() {
  return useQuery({
    queryKey: ['user-images'],
    queryFn: async () => {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Failed to load images');
      return res.json();
    },
  });
}
