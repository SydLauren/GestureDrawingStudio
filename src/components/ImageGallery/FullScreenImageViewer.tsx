'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserImages } from '@/lib/db/hooks/useUserImages';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

enum TimerMode {
  Custom = 'custom',
  Countup = 'countup',
}

export default function FullscreenImageViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageId = searchParams.get('imageId');
  const { data: images } = useUserImages();

  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [timerMode, setTimerMode] = useState(TimerMode.Custom);
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const image = images?.find((img) => img.id === imageId);

  const closeViewer = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('imageId');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const showPrevImage = useCallback(() => {
    if (!images || !imageId) return;
    const index = images.findIndex((img) => img.id === imageId);
    if (index > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('imageId', images[index - 1].id);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [images, imageId, router, searchParams]);

  const showNextImage = useCallback(() => {
    if (!images || !imageId) return;
    const index = images.findIndex((img) => img.id === imageId);
    if (index < images.length - 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('imageId', images[index + 1].id);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [images, imageId, router, searchParams]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeViewer();
      }
      if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
      if (e.key === 'ArrowRight') {
        showNextImage();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchParams, images, closeViewer, showNextImage, showPrevImage]);

  if (!imageId || !image) return null;

  return (
    <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl items-center justify-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        {/* Header Bar */}
        <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between bg-black/70 px-4 py-2 text-white">
          <h2 className="max-w-[60%] truncate text-lg font-semibold">
            {image.name || 'Untitled'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimerDialog(true)}
              className="rounded bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              🖌 Start Drawing
            </button>
            <button
              onClick={closeViewer}
              className="rounded p-2 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
        {/* Left arrow */}
        {images &&
          imageId &&
          images.findIndex((img) => img.id === imageId) > 0 && (
            <button
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              onClick={showPrevImage}
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
          )}
        <div className="relative h-full max-h-[90vh] w-full max-w-6xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-images/${image.path}`}
            alt={image.name}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        {images &&
          imageId &&
          images.findIndex((img) => img.id === imageId) < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              onClick={showNextImage}
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          )}
      </div>
      <Dialog open={showTimerDialog} onOpenChange={setShowTimerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Drawing Session</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup
              defaultValue={TimerMode.Countup}
              value={timerMode}
              onValueChange={(mode: TimerMode) => setTimerMode(mode)}
              className="space-y-4"
            >
              <div>
                <RadioGroupItem
                  value={TimerMode.Countup}
                  id={TimerMode.Countup}
                />
                <Label htmlFor={TimerMode.Countup} className="ml-2">
                  ⏱ Start timer (counting up)
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value={TimerMode.Custom}
                  id={TimerMode.Custom}
                />
                <Label htmlFor={TimerMode.Custom} className="ml-2">
                  Set a custom duration:
                </Label>

                {timerMode === TimerMode.Custom && (
                  <div className="mt-2 flex gap-2">
                    <div className="flex w-24 flex-col">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        value={duration.hours}
                        onChange={(e) =>
                          setDuration((d) => ({ ...d, hours: +e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex w-24 flex-col">
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={duration.minutes}
                        onChange={(e) =>
                          setDuration((d) => ({
                            ...d,
                            minutes: +e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex w-24 flex-col">
                      <Label htmlFor="seconds">Seconds</Label>
                      <Input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={duration.seconds}
                        onChange={(e) =>
                          setDuration((d) => ({
                            ...d,
                            seconds: +e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                if (timerMode === 'countup') {
                  // TODO: start count-up timer
                } else {
                  // TODO: start custom timer with duration
                }
              }}
            >
              Start
            </Button>
            <Button variant="ghost" onClick={() => setShowTimerDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
