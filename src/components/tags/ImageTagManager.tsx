'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TagDisplayMode, TagDropdown } from '@/components/ui/TagDropdown';
import { toast } from 'sonner';
import { Tag } from '@prisma/client';
import { fetchAllTags } from '@/lib/db/tags';
import Qkey from '@/lib/queryKeys';

type ImageTagManagerProps = {
  imageIds: string[];
  initialSelectedTags: Tag[];
  tagMode?: TagDisplayMode;
};

export default function ImageTagManager({
  imageIds,
  initialSelectedTags,
  tagMode,
}: ImageTagManagerProps) {
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialSelectedTags);

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: [Qkey.UserTags],
    queryFn: fetchAllTags,
  });

  const bulkMutation = useMutation({
    mutationFn: async ({
      tagsToAdd,
      tagsToRemove,
    }: {
      tagsToAdd: Tag[];
      tagsToRemove: Tag[];
    }) => {
      const res = await fetch('/api/images/bulk-add-tags', {
        method: 'POST',
        body: JSON.stringify({
          imageIds,
          tags: tagsToAdd,
          tagsToRemove: tagsToRemove.map((t) => t.id),
        }),
      });
      if (!res.ok) throw new Error('Failed to update tags');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Qkey.UserTags] });
      queryClient.invalidateQueries({ queryKey: [Qkey.UserTags] });
      toast.success('Tags updated');
    },
    onError: () => {
      toast.error('Failed to update tags');
    },
  });

  const toggleTag = (tagId: string) => {
    const tag = allTags.find((t) => t.id === tagId);
    if (!tag) return;

    const isSelected = selectedTags.some((t) => t.id === tagId);
    setSelectedTags((prev) =>
      isSelected ? prev.filter((t) => t.id !== tagId) : [...prev, tag],
    );
  };

  const createNewTag = (name: string) => {
    const tempTag = { id: name, name } as Tag;
    setSelectedTags((prev) => [...prev, tempTag]);
  };

  const handleDropdownClose = () => {
    const initialIds = new Set(initialSelectedTags.map((t) => t.id));
    const currentNames = new Set(selectedTags.map((t) => t.name));

    const tagsToAdd = selectedTags.filter(
      (t) => !initialIds.has(t.id) || !t.id, // includes new tags (no ID yet)
    );

    const tagsToRemove = initialSelectedTags.filter(
      (t) => !currentNames.has(t.name),
    );

    if (tagsToAdd.length || tagsToRemove.length) {
      bulkMutation.mutate({ tagsToAdd, tagsToRemove });
    }
  };

  return (
    <TagDropdown
      allTags={allTags}
      selectedTags={selectedTags}
      onToggle={toggleTag}
      onCreateNewTag={createNewTag}
      onClose={handleDropdownClose}
      displayMode={tagMode}
    />
  );
}
