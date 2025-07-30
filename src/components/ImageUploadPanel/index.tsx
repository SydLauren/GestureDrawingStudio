'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ImageUploader from '@/components/ImageUploader';
import { uploadImage } from '@/lib/storage/imageUpload';
import { useCreateImage } from '@/lib/db/hooks/useCreateImage';
import { sanitizeFilename } from '@/lib/utils/sanitizers';
import { toast } from 'sonner';

type Props = {
  userId: string;
};

export default function ImageUploadPanel({ userId }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const createImage = useCreateImage();
  const queryClient = useQueryClient();

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);

    try {
      for (const file of files) {
        const { path } = await uploadImage(file, userId);

        await createImage.mutateAsync({
          userId,
          path,
          name: sanitizeFilename(file.name),
        });
      }

      // ✅ Refresh the gallery
      queryClient.invalidateQueries({ queryKey: ['user-images'] });
      toast.success('Upload complete!');
    } catch (err: any) {
      console.error(err);
      toast.error('Upload failed', {
        description: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Upload Images</h2>
      <ImageUploader onFilesSelected={handleUpload} />
      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
