'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/lib/store/session';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SessionPage() {
  const router = useRouter();
  const config = useSessionStore((s) => s.config);

  const [timeLeft, setTimeLeft] = useState(config?.timePerImage ?? 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(Date.now()); // Used to force image refresh

  const placeholderImage = `https://placehold.co/1200x800/png?text=${currentIndex + 1}`;

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      if (currentIndex < (config?.numberOfImages ?? 1) - 1) {
        setCurrentIndex((i) => i + 1);
        setShuffleKey(Date.now()); // force new image
        setTimeLeft(config?.timePerImage ?? 0);
      } else {
        router.push('/studio'); // session complete
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    timeLeft,
    isPaused,
    currentIndex,
    config?.numberOfImages,
    config?.timePerImage,
    router,
  ]);

  const handlePauseResume = () => setIsPaused((prev) => !prev);

  const handleShuffle = () => {
    setShuffleKey(Date.now());
    setTimeLeft(config?.timePerImage ?? 0);
  };

  const handleFlip = () => {
    alert('Flip image (not yet implemented)');
  };

  if (!config) return null;

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black text-white">
      {/* Controls */}
      <div className="absolute left-4 top-4 z-10 space-x-2">
        <span className="text-lg font-bold">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>
        <Button size="sm" variant="secondary" onClick={handlePauseResume}>
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleShuffle}>
          Shuffle Image
        </Button>
        <Button size="sm" variant="secondary" onClick={handleFlip}>
          Flip
        </Button>
      </div>

      {/* Fullscreen Image */}
      <div className="relative h-full w-full">
        <Image
          key={shuffleKey}
          src={placeholderImage}
          alt="Gesture Reference"
          fill
          sizes="100vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-2xl font-bold">
          Paused
        </div>
      )}
    </div>
  );
}
