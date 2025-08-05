'use client';

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { TagIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag } from '@prisma/client';
import { useSetAtom } from 'jotai';
import imageTagDropdownOpen from '@/lib/atoms/imageTagDropdownOpen';

export type TagDisplayMode = 'condensed' | 'list';

interface TagDropdownProps {
  allTags: Tag[];
  selectedTags: Tag[];
  onToggle: (tagId: string) => void;
  onClose: () => void;
  onCreateNewTag?: (name: string) => void;
  displayMode?: TagDisplayMode;
}

interface ActualDropdownProps extends TagDropdownProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const TagDropdown = (props: TagDropdownProps) => {
  const [open, setOpen] = useState(false);
  const setImageTagDropdownOpen = useSetAtom(imageTagDropdownOpen);
  useEffect(() => {
    setImageTagDropdownOpen(open);
  }, [open, setImageTagDropdownOpen]);

  const { onClose, displayMode } = props;

  useEffect(() => {
    window.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') {
        setOpen(false);
        onClose();
      }
    });
  }, [onClose]);

  if (displayMode === 'list')
    return <ListTagDropdown {...props} open={open} setOpen={setOpen} />;
  return <CondensedTagDropdown {...props} open={open} setOpen={setOpen} />;
};

function CondensedTagDropdown({
  open,
  setOpen,
  allTags,
  selectedTags,
  onToggle,
  onClose,
  onCreateNewTag,
}: ActualDropdownProps) {
  const [search, setSearch] = useState('');

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose?.();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm"
        >
          <TagIcon className="h-4 w-4" />
          <span>{selectedTags.length}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" side="right" className="p-0">
        <TagDropdownContent
          search={search}
          setSearch={setSearch}
          allTags={allTags}
          selectedTags={selectedTags}
          onToggle={onToggle}
          onCreateNewTag={onCreateNewTag}
        />
      </PopoverContent>
    </Popover>
  );
}

// TODO: Come back to this
function ListTagDropdown({
  open,
  setOpen,
  allTags,
  selectedTags,
  onToggle,
  onClose,
  onCreateNewTag,
}: ActualDropdownProps) {
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVisible, setMaxVisible] = useState<number>(selectedTags.length);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // const tagWidths: number[] = [];
    const testTag = document.createElement('span');
    testTag.className =
      'text-sm px-3 py-1 rounded-full border whitespace-nowrap';
    testTag.style.visibility = 'hidden';
    testTag.style.position = 'absolute';
    document.body.appendChild(testTag);

    const availableWidth = container.offsetWidth - 90;
    let totalWidth = 0;
    let visibleCount = 0;

    for (const tag of selectedTags) {
      testTag.innerText = tag.name;
      const width = testTag.offsetWidth + 16;
      totalWidth += width;

      if (totalWidth < availableWidth) {
        visibleCount++;
      } else {
        break;
      }
    }

    document.body.removeChild(testTag);
    setMaxVisible(visibleCount);
  }, [selectedTags]);

  const visibleTags = selectedTags.slice(0, maxVisible);
  const hiddenTags = selectedTags.slice(maxVisible);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose?.();
      }}
    >
      <div ref={containerRef} className="flex flex-wrap items-center gap-2">
        {visibleTags.map((tag) => (
          <PopoverTrigger asChild key={tag.id}>
            <Button
              variant="outline"
              className="rounded-full border-muted bg-muted px-3 py-1 text-sm text-foreground transition hover:bg-accent"
            >
              {tag.name}
            </Button>
          </PopoverTrigger>
        ))}

        {hiddenTags.length > 0 && (
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full px-2 text-sm text-muted-foreground"
            >
              +{hiddenTags.length}
            </Button>
          </PopoverTrigger>
        )}

        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full px-2 text-sm text-muted-foreground"
          >
            + Tags
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent align="start" className="p-0">
        <TagDropdownContent
          search={search}
          setSearch={setSearch}
          allTags={allTags}
          selectedTags={selectedTags}
          onToggle={onToggle}
          onCreateNewTag={onCreateNewTag}
        />
      </PopoverContent>
    </Popover>
  );
}

export const TagDropdownContent = ({
  search,
  setSearch,
  allTags,
  selectedTags,
  onToggle,
  onCreateNewTag,
}: {
  search: string;
  setSearch: (s: string) => void;
  allTags: Tag[];
  selectedTags: Tag[];
  onToggle: (tagId: string) => void;
  onCreateNewTag?: (name: string) => void;
}) => {
  const mergedTags = useMemo(() => {
    const tagMap = new Map<string, Tag>();

    // Add allTags
    allTags?.forEach((tag) => {
      tagMap.set(tag.name.toLowerCase(), tag);
    });

    // Add selectedTags that aren’t in allTags
    selectedTags?.forEach((selectedTag) => {
      const exists = allTags.find((tag) => tag.id === selectedTag.id);
      if (!exists) {
        // This is a new tag; we try to find it by name fallback
        const fallback = { id: selectedTag?.name, name: selectedTag?.name }; // fallback name = id (works for local-only tags)
        tagMap.set(fallback.name.toLowerCase(), fallback as Tag);
      }
    });

    return Array.from(tagMap.values());
  }, [allTags, selectedTags]);

  const filteredTags = useMemo(() => {
    return mergedTags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, mergedTags]);

  const exactMatch = useMemo(() => {
    return allTags.some(
      (tag) => tag.name.toLowerCase() === search.trim().toLowerCase(),
    );
  }, [search, allTags]);

  const showCreateOption =
    search.trim() !== '' && !exactMatch && onCreateNewTag;

  return (
    <div className="w-full p-0">
      <div className="border-b p-2">
        <Input
          placeholder="Change or add tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />
      </div>
      <div className="max-h-60 overflow-y-auto">
        {filteredTags.map((tag) => {
          const isSelected =
            selectedTags?.findIndex(
              (selectedTag) => selectedTag.id === tag.id,
            ) > -1;
          return (
            <div
              key={tag.id}
              onClick={(e) => {
                e.preventDefault();
                onToggle(tag.id);
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent',
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(tag.id)}
                className="pointer-events-none"
              />
              <span className="truncate">{tag.name}</span>
            </div>
          );
        })}

        {showCreateOption && (
          <button
            onClick={() => {
              onCreateNewTag?.(search.trim());
              setSearch('');
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <PlusIcon className="h-4 w-4" />
            <span>
              Create new tag:{' '}
              <span className="italic">{`${search.trim()}`}</span>
            </span>
          </button>
        )}

        {filteredTags.length === 0 && !showCreateOption && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No tags found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TagDropdown;
