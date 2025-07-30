// app/studio/session/page.tsx (or wherever it's located)
'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/lib/store/session';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUserImages } from '@/lib/db/hooks/useUserImages';
import Image from 'next/image';
import { constructImageUrlFromPath } from '@/lib/utils/images';

export default function SessionPage() {
  const router = useRouter();
  const config = useSessionStore((s) => s.config);
  const { data: allImages, isLoading, isError } = useUserImages();

  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(Date.now());

  // Generate a session image list once images are loaded
  useEffect(() => {
    if (!config || !allImages?.length) return;

    const loopedImages = [];
    const total = config.numberOfImages ?? 1;

    for (let i = 0; i < total; i++) {
      loopedImages.push(allImages[i % allImages.length].path);
    }

    setSessionImages(loopedImages);
    setTimeLeft(config.timePerImage ?? 0);
  }, [allImages, config]);

  // Timer logic
  useEffect(() => {
    if (isPaused || !sessionImages.length) return;

    if (timeLeft <= 0) {
      if (currentIndex < sessionImages.length - 1) {
        setCurrentIndex((i) => i + 1);
        setShuffleKey(Date.now());
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
    sessionImages.length,
    config?.timePerImage,
    router,
  ]);

  const handlePauseResume = () => setIsPaused((prev) => !prev);

  const handleShuffle = () => {
    const currentImage = sessionImages[currentIndex];
    const otherImages = allImages
      .map((img) => img.path)
      .filter((p) => p !== currentImage);
    const newImage =
      otherImages[Math.floor(Math.random() * otherImages.length)] ??
      currentImage;

    const newSessionImages = [...sessionImages];
    newSessionImages[currentIndex] = newImage;
    setSessionImages(newSessionImages);
    setShuffleKey(Date.now());
    setTimeLeft(config?.timePerImage ?? 0);
  };

  const handleFlip = () => {
    alert('Flip image (not yet implemented)');
  };

  if (!config || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (isError || !allImages?.length) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Failed to load images.
      </div>
    );
  }

  const currentImage = sessionImages[currentIndex];

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black text-white">
      {/* Controls */}
      <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
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
        <Button
          size="sm"
          variant="destructive"
          onClick={() => router.push('/studio')}
        >
          End Session
        </Button>
      </div>

      {/* Fullscreen Image */}
      <div className="relative h-full w-full">
        <Image
          key={shuffleKey}
          src={constructImageUrlFromPath(currentImage)}
          alt="Gesture Reference"
          fill
          sizes="100vw"
          style={{ objectFit: 'contain', background: 'black' }}
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
