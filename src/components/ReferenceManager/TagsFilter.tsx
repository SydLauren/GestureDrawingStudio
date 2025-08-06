import { useCallback, useEffect, useState } from 'react';
import { Tag } from '@prisma/client';

import { TagDropdownContent } from '@/components/ui/TagDropdown';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { X } from 'lucide-react';
import { useSetAtom } from 'jotai';
import imageTagDropdownOpen from '@/lib/atoms/imageTagDropdownOpen';

interface TagsFilterProps {
  selectedTagIds: string[];
  allTags: Tag[];
  onClose: (selectedTagIds: string[]) => void;
  openOnMount?: boolean;
}

export default function TagsFilter({
  selectedTagIds,
  allTags,
  onClose,
  openOnMount = false,
}: TagsFilterProps) {
  const setTagDropdownOpen = useSetAtom(imageTagDropdownOpen);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [localSelectedTagIds, setLocalSelectedTagIds] =
    useState<string[]>(selectedTagIds);

  const selectedTags = allTags.filter((tag) => selectedTagIds.includes(tag.id));
  const localSelectedTags = allTags.filter((tag) =>
    localSelectedTagIds.includes(tag.id),
  );

  useEffect(() => {
    if (openOnMount) {
      setOpen(true);
    }
  }, [openOnMount]);

  useEffect(() => {
    setTagDropdownOpen(open);
  }, [open, setTagDropdownOpen]);

  useEffect(() => {
    // Reset local state when selectedTagIds changes
    setLocalSelectedTagIds(selectedTagIds);
  }, [selectedTagIds]);

  const handleToggle = (tagId: string) => {
    setLocalSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);

      if (!newOpen) {
        // Menu is closing, apply the filters
        onClose(localSelectedTagIds);
        setSearch('');
      } else {
        // Menu is opening, reset local state to current filters
        setLocalSelectedTagIds(selectedTagIds);
      }
    },
    [onClose, selectedTagIds, localSelectedTagIds],
  );

  const handleRemoveTag = (tagId: string) => {
    const newTagIds = selectedTagIds.filter((id) => id !== tagId);
    onClose(newTagIds);
  };

  useEffect(() => {
    window.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') {
        handleOpenChange(false);
      }
    });
  }, [handleOpenChange]);

  return (
    <div className="mb-4">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {selectedTags.length > 0 ? (
              <div className="flex flex-1 items-center gap-1 overflow-hidden">
                {selectedTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag.id);
                      }}
                      className="rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedTags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{selectedTags.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Filter by tags...</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <TagDropdownContent
            search={search}
            setSearch={setSearch}
            allTags={allTags}
            selectedTags={localSelectedTags}
            onToggle={handleToggle}
            onCreateNewTag={undefined} // Prevent creation of new tags
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
