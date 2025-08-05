'use client';

import { ImageFilters, useUserImages } from '@/lib/db/hooks/useUserImages';
import { ImageWithTags } from '@/lib/db/hooks/useUserImages';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import AddTagsModal from './AddTagsModal';
import ImageTagManager from '../tags/ImageTagManager';
import { useGlobalFileDragDetection } from '@/hooks/useGlobalFileDragDetection';
import { useAtomValue } from 'jotai';
import imageTagDropdownOpen from '@/lib/atoms/imageTagDropdownOpen';
import { twMerge } from 'tailwind-merge';

interface Props {
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  imageFilters?: ImageFilters;
}

export default function ImageGallery({
  selected,
  setSelected,
  imageFilters,
}: Props) {
  const { data: images, isLoading, isError } = useUserImages(imageFilters);
  useGlobalFileDragDetection();
  const tagsDropdownOpen = useAtomValue(imageTagDropdownOpen);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showAddTagsModal, setShowAddTagsModal] = useState(false);

  const multiSelectMode = selected.size > 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImageClick = (id: string) => {
    if (multiSelectMode) {
      toggleSelect(id);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('imageId', id);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  if (isLoading)
    return <p className="text-muted-foreground">Loading images...</p>;
  if (isError) return <p className="text-destructive">Failed to load images</p>;
  if (!images?.length) return <p>No images yet. Try uploading one!</p>;

  const selectedCount = selected.size;

  return (
    <>
      {multiSelectMode && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded border bg-muted px-4 py-2 shadow-sm">
          {/* Left */}
          <span className="text-sm font-medium">
            {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected
          </span>

          {/* Center */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddTagsModal(true)}
            className="mx-auto"
          >
            + Add Tags
          </Button>

          {/* Right */}
          <div className="flex gap-4 text-sm font-medium text-primary">
            <button
              onClick={() => setSelected(new Set())}
              className="underline underline-offset-4 hover:opacity-80"
            >
              Deselect all
            </button>
            <button
              onClick={() => setSelected(new Set(images.map((img) => img.id)))}
              className="underline underline-offset-4 hover:opacity-80"
            >
              Select all
            </button>
          </div>
        </div>
      )}
      <div>
        <div
          className={twMerge(
            'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4',
            tagsDropdownOpen && 'pointer-events-none',
          )}
        >
          {images.map((img: ImageWithTags) => {
            const isSelected = selected.has(img.id);

            return (
              <div
                key={img.id}
                className={`group relative aspect-square cursor-pointer overflow-hidden rounded border transition ${
                  isSelected ? 'scale-95 bg-muted' : ''
                }`}
                onClick={() => handleImageClick(img.id)}
              >
                {/* Checkbox: top-left */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(img.id);
                  }}
                  className={`absolute left-2 top-2 z-10 rounded bg-white/70 p-1 opacity-0 transition group-hover:opacity-100 ${
                    multiSelectMode ? '!opacity-100' : ''
                  }`}
                >
                  <Checkbox checked={isSelected} />
                </div>

                {/* Tag icon: top-right */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-2 top-2 z-10 rounded bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <ImageTagManager
                    imageIds={[img.id]}
                    initialSelectedTags={img.imageTags?.map((it) => it.tag)}
                  />
                </div>

                {/* Image */}
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-images/${img.path}`}
                  alt={img.name}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      <AddTagsModal
        open={showAddTagsModal}
        setOpen={setShowAddTagsModal}
        selectedImageIds={Array.from(selected)}
      />
    </>
  );
}
