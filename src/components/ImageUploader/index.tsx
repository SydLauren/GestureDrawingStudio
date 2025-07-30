'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  onFilesSelected: (files: File[]) => void;
};

export default function ImageUploader({ onFilesSelected }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div
      className={`rounded-md border-2 border-dashed p-6 text-center transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-muted'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
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
