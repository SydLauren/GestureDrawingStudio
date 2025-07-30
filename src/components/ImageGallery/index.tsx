'use client';

import { useUserImages } from '@/lib/db/hooks/useUserImages';
import Image from 'next/image';

export default function ImageGallery() {
  const { data: images, isLoading, isError } = useUserImages();

  if (isLoading)
    return <p className="text-muted-foreground">Loading images...</p>;
  if (isError) return <p className="text-destructive">Failed to load images</p>;

  if (!images?.length) return <p>No images yet. Try uploading one!</p>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {images.map((img: any) => (
        <div
          key={img.id}
          className="relative aspect-square overflow-hidden rounded border"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-images/${img.path}`}
            alt={img.name}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
