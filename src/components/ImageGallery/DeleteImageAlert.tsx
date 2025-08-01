'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteImage } from '@/lib/db/hooks/useDeleteImage';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageId: string;
}

export default function DeleteImageAlert({ open, setOpen, imageId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deleteMutation = useDeleteImage();

  const handleCloseViewer = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('imageId');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleDeleteImage = () => {
    deleteMutation.mutate(imageId, {
      onSuccess: () => {
        handleCloseViewer();
        toast.success('Image deleted');
      },
      onError: (err) => {
        console.error('Failed to delete image:', err);
        toast.error('Image deletion failed');
        // Optionally show a toast error
      },
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Image</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteImage}
            className="bg-destructive text-white hover:bg-destructive/80"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
