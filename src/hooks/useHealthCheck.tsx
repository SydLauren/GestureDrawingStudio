import QUERY_KEYS from '@/lib/queryKeys';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useToast } from './use-toast';

const useHealthCheck = (interval: number = 10000) => {
  const { toast } = useToast();

  const { error } = useQuery({
    queryKey: [QUERY_KEYS.HEALTH_CHECK],
    queryFn: async () => {
      const response = await axios.get('/api/health');
      if (response.status !== 200) {
        throw new Error('Health check failed');
      }
      return true;
    },
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    retry: 1,
    initialData: true,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Health check failed',
        description: 'Something is wrong. Please reload the page',
      });
    }
  }, [error, toast]);

  return error ? false : true;
};

export default useHealthCheck;
