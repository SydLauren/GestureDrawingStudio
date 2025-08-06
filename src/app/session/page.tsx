'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSessionStore } from '@/lib/store/session';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUserImages } from '@/lib/db/hooks/useUserImages';
import Image from 'next/image';
import { constructImageUrlFromPath } from '@/lib/utils/images';

export default function SessionPage() {
  const router = useRouter();
  const config = useSessionStore((s) => s.config);
  const {
    data: allImages,
    isLoading,
    isError,
  } = useUserImages(config.imageFilters);

  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [usedImages, setUsedImages] = useState<Set<string>>(new Set());
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(Date.now());

  const mode = config?.timerMode ?? 'fixed';

  // Get next random image that hasn't been used
  const getNextRandomImage = useCallback(() => {
    if (!availableImages.length) return '';

    // Get unused images
    const unusedImages = availableImages.filter(
      (path) => !usedImages.has(path),
    );

    // If all images have been used, reset the used set and use all images again
    if (unusedImages.length === 0) {
      setUsedImages(new Set());
      const randomImage =
        availableImages[Math.floor(Math.random() * availableImages.length)];
      return randomImage;
    }

    // Pick random from unused images
    const randomImage =
      unusedImages[Math.floor(Math.random() * unusedImages.length)];
    return randomImage;
  }, [availableImages, usedImages]);

  // Initialize available images and set first random image
  useEffect(() => {
    if (!config || !allImages?.length) return;

    if (config?.imageId) {
      const selected = allImages.find((img) => img.id === config.imageId);
      if (selected) {
        setAvailableImages([selected.path]);
        setCurrentImage(selected.path);
        setUsedImages(new Set([selected.path]));
        setTimeLeft(config.timePerImage ?? 0);
      } else {
        console.warn('Image with ID not found in user images.');
      }
      return;
    }

    // Create available images pool
    const imagePaths = allImages.map((img) => img.path);
    setAvailableImages(imagePaths);

    // Set random first image
    const randomImage =
      imagePaths[Math.floor(Math.random() * imagePaths.length)];
    setCurrentImage(randomImage);
    setUsedImages(new Set([randomImage]));
    setTimeLeft(config.timePerImage ?? 0);
    setCurrentIndex(0);
  }, [allImages, config]);

  // Timer logic
  useEffect(() => {
    if (isPaused || !availableImages.length) return;

    if (mode === 'countup') {
      // advance the timer to count up
      const interval = setInterval(() => {
        setTimeLeft((t) => t + 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    // Only advance to next image when timer hits exactly 0
    if (timeLeft === 0 && currentIndex < (config?.numberOfImages ?? 1) - 1) {
      // Move to next image - pick random from unused pool
      const randomImage = getNextRandomImage();
      setCurrentImage(randomImage);
      setUsedImages((prev) => new Set([...prev, randomImage]));
      setCurrentIndex((i) => i + 1);
      setShuffleKey(Date.now());
      setTimeLeft(config?.timePerImage ?? 0);
      return;
    }

    // End session when timer hits 0 and we're on the last image
    if (timeLeft === 0 && currentIndex >= (config?.numberOfImages ?? 1) - 1) {
      router.push('/studio'); // session complete
      return;
    }

    // Continue countdown if timer is greater than 0
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [
    timeLeft,
    isPaused,
    currentIndex,
    availableImages,
    usedImages,
    config?.timePerImage,
    config?.numberOfImages,
    router,
    mode,
    getNextRandomImage,
  ]);

  const handlePauseResume = () => setIsPaused((prev) => !prev);

  const handleShuffle = () => {
    if (!availableImages.length) return;

    const newImage = getNextRandomImage();
    setCurrentImage(newImage);
    setUsedImages((prev) => new Set([...prev, newImage]));
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

      {/* Progress indicator */}
      <div className="absolute right-4 top-4 z-10 text-sm">
        Image {currentIndex + 1} of {config?.numberOfImages}
        <br />
        Pool: {usedImages.size}/{availableImages.length} used
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
