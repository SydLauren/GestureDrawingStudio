import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/react-query/ReactQueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import JotaiProvider from '@/providers/JotaiProvider';

const geistSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gesture Drawing Studio',
  description: 'Upload and tag your figure drawing references.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <JotaiProvider>
          <ReactQueryProvider>
            <div className="fixed h-12 w-full bg-foreground" />
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
