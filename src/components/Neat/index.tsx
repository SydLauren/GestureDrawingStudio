'use client';

import { useState } from 'react';
import { Button } from '@ui/button';
import Flex from '@ui/Flex';
import useHealthCheck from '@/hooks/useHealthCheck';

const Neat = () => {
  const [count, setCount] = useState(0);

  useHealthCheck();

  return (
    <Flex gap={2} className="w-full">
      <Button
        data-testid={'neat-btn'}
        onClick={() => setCount((prev) => prev + 1)}
      >
        Neat!
      </Button>
      <p>{`Neat counter: ${count}`}</p>
    </Flex>
  );
};

export default Neat;
