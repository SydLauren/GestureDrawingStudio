'use client';
import Neat from '@/components/Neat';
import Flex from '@/components/ui/Flex';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Flex className="h-screen w-full">
        <Flex
          direction={'column'}
          justify={'center'}
          gap={3}
          className="w-full"
        >
          Hi There! This template has:
          <ul className="list-disc">
            <li>React Query</li>
            <li>Axios</li>
            <li>Shadcn/ui</li>
            <li>Ramda</li>
            <li>TailwindCSS</li>
            <li>Heroicons</li>
            <li>CVA</li>
            <li>Playwright</li>
            <li>Storybook</li>
            <li>Jest</li>
          </ul>
        </Flex>
        <Neat />
      </Flex>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
