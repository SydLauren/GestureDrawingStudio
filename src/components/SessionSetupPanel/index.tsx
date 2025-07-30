// src/components/SessionSetupPanel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  formatSecondsToColon,
  formatSecondsVerbose,
} from '@/lib/utils/formatTime';
import { useSessionStore } from '@/lib/store/session';

const TIME_OPTIONS = [300, 180, 120, 90, 60, 45, 30];
const IMAGE_COUNT_OPTIONS = [10, 20, 30, 40];

export type SessionDefinition = {
  timePerImage: number; // seconds
  numberOfImages: number;
  // Future: breaks, rampUp, spacing, etc
};

export default function SessionSetupPanel() {
  const router = useRouter();
  const { setConfig } = useSessionStore();

  const [timePerImage, setTimePerImage] = useState(60);
  const [numberOfImages, setNumberOfImages] = useState(20);

  const handleStart = () => {
    setConfig({ timePerImage, numberOfImages });
    router.push('/session');
  };

  const totalSeconds = timePerImage * numberOfImages;
  const totalDisplay = formatSecondsVerbose(totalSeconds); // e.g. "6 minutes, 30 seconds"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-medium">Interval</h2>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((t) => (
            <Button
              key={t}
              variant={t === timePerImage ? 'default' : 'outline'}
              onClick={() => setTimePerImage(t)}
            >
              {formatSecondsToColon(t)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-medium">I want to draw</h2>
        <div className="flex flex-wrap gap-2">
          {IMAGE_COUNT_OPTIONS.map((count) => (
            <Button
              key={count}
              variant={count === numberOfImages ? 'default' : 'outline'}
              onClick={() => setNumberOfImages(count)}
            >
              {count}
            </Button>
          ))}
          <span className="ml-2 self-center text-muted-foreground">images</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        🕒 Total Time: {totalDisplay}
      </p>
      <Button className="mt-4" onClick={handleStart}>
        Start Session
      </Button>
    </div>
  );
}
