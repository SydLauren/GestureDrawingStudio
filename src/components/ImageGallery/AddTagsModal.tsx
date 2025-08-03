'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tag } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTagsToImages, fetchAllTags, createTag } from '@/lib/db/tags';

interface AddTagsModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedImageIds: string[];
}

export default function AddTagsModal({
  open,
  setOpen,
  selectedImageIds,
}: AddTagsModalProps) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchAllTags,
  });

  const onClose = () => {
    setSelectedTags([]);
    setInputValue('');
    setOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((tags) => tags.filter((tag) => tag.id !== tagId));
  };

  const filteredTags = availableTags.filter((tag) => {
    return (
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((t) => t.id === tag.id)
    );
  });

  const addTagsMutation = useMutation({
    mutationFn: (tags: Tag[]) => addTagsToImages(selectedImageIds, tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-images'] });
      onClose();
    },
  });

  const handleAddTag = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setInputValue('');
  };

  const handleCreateNewTag = async () => {
    const newTag = await createTag(inputValue);
    setSelectedTags((prev) => [...prev, newTag]);
    queryClient.setQueryData(['tags'], (old: Tag[] = []) => [...old, newTag]);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (!selectedTags.length) return;
    addTagsMutation.mutate(selectedTags);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        } else {
          setOpen(open);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-input">Search or create tag</Label>
            <Input
              id="tag-input"
              placeholder="Search or create tag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="max-h-48 overflow-auto rounded border bg-white p-2 shadow">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag: Tag) => (
                  <div
                    key={tag.id}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-muted"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag.name}
                  </div>
                ))
              ) : (
                <div
                  className="cursor-pointer rounded px-2 py-1 text-muted-foreground hover:bg-muted"
                  onClick={handleCreateNewTag}
                >
                  {`+ Create "${inputValue}"`}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={addTagsMutation.isPending}>
            Add Tags
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
