'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { useAtom } from 'jotai';
import draggingFilesAttom from '@/lib/atoms/draggingFilesAtom';

type Props = {
  onFilesSelected: (files: File[]) => void;
};

export default function ImageUploader({ onFilesSelected }: Props) {
  const [dragOver] = useAtom(draggingFilesAttom);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  if (!dragOver) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'absolute z-30 h-full w-full rounded-md border-2 p-6 text-center transition-colors',
        dragOver
          ? 'border-dashed border-blue-500 bg-blue-50/80'
          : 'border-muted',
      )}
      onDrop={handleDrop}
    >
      <p className="mb-3 text-sm">Drag and drop images here</p>
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        Select from computer
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}
