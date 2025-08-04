'use client';

import { Provider } from 'jotai';

const JotaiProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Provider>{children}</Provider>;
};

export default JotaiProvider;
