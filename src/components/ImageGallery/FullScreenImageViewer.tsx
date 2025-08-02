'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserImages } from '@/lib/db/hooks/useUserImages';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRemoveTagFromImage } from '@/lib/db/hooks/useRemoveTagFromImage';
import Image from 'next/image';

import StartSessionDialog from './StartSessionDialog';
import { Button } from '../ui/button';
import DeleteImageAlert from './DeleteImageAlert';

export default function FullscreenImageViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageId = searchParams.get('imageId');
  const { data: images } = useUserImages();

  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, setEditingTags] = useState(false);

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

  const removeTagMutation = useRemoveTagFromImage();

  const handleRemoveTag = (tagId: string) => {
    if (!image) return;
    removeTagMutation.mutate({
      imageId: image.id,
      tagId,
    });
  };

  if (!imageId || !image) return null;

  return (
    <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl items-center justify-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        {/* Header Bar */}
        <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-center bg-black/70 px-4 py-2 text-white">
          {/* Left side (title) */}
          <div className="absolute left-4 top-2 max-w-[60%] truncate text-lg font-semibold">
            {image.name || 'Untitled'}
          </div>
          {/* Center (tags) */}
          <div className="flex flex-wrap items-center gap-2">
            {image.imageTags?.map((imageTag) => (
              <div
                key={imageTag.tag.id}
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                <span>{imageTag.tag.name}</span>
                <button
                  onClick={() => handleRemoveTag(imageTag.tag.id)}
                  className="text-white hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => setEditingTags(true)}
              className="rounded-full bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/20"
            >
              + Add Tag
            </button>
          </div>
          <div className="absolute right-4 top-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTimerDialog(true)}
                className="rounded bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                🖌 Start Drawing
              </button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
              <button
                onClick={closeViewer}
                className="rounded p-2 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
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
      <StartSessionDialog
        open={showTimerDialog}
        setOpen={setShowTimerDialog}
        imageId={imageId}
      />
      <DeleteImageAlert
        open={showDeleteConfirm}
        setOpen={setShowDeleteConfirm}
        imageId={imageId}
      />
    </div>
  );
}
