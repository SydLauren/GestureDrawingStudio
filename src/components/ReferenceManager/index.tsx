'use client';

import ImageUploadPanel from '../ImageUploadPanel';
import { ListFilterIcon } from 'lucide-react';
import { useAtomValue } from 'jotai';
import userAtom from '@/lib/atoms/userAtom';
import { Button } from '@/components/ui/button';

import ImageGallery from '../ImageGallery';
import FullscreenImageViewer from '../ImageGallery/FullScreenImageViewer';
import { useMemo, useState } from 'react';
import TagsFilter from '../TagsFilter/TagsFilter';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@prisma/client';
import Qkey from '@/lib/queryKeys';
import { fetchAllTags } from '@/lib/db/tags';
import { ImageFilters } from '@/lib/db/hooks/useUserImages';

export default function ReferenceManager() {
  const user = useAtomValue(userAtom);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterShelfOpen, setFilterShelfOpen] = useState(false);
  const [filterTagIds, setFilterTagIds] = useState<Set<string>>(new Set());

  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: [Qkey.UserTags],
    queryFn: fetchAllTags,
  });

  const imageFilters: ImageFilters = useMemo(() => {
    return {
      tagIds: filterTagIds.size > 0 ? Array.from(filterTagIds) : undefined,
    };
  }, [filterTagIds]);

  if (!user) return null;

  const toggleFilterShelf = () => {
    setFilterShelfOpen((open) => !open);
  };

  return (
    <>
      <div className={'relative'}>
        <div className="mb-4 flex w-full items-center justify-between">
          {/**Left side of bar */}
          <div>
            <Button variant={'ghost'} size={'icon'} onClick={toggleFilterShelf}>
              <ListFilterIcon />
            </Button>
          </div>
          <div>
            <Button variant={'secondary'} size={'sm'}>
              + Upload
            </Button>
          </div>
        </div>
        {filterShelfOpen && (
          <TagsFilter
            selectedTagIds={Array.from(filterTagIds)}
            allTags={allTags}
            onClose={(selectedTagIds) => {
              setFilterTagIds(new Set(selectedTagIds));
            }}
            openOnMount={true}
          />
        )}
        <ImageUploadPanel userId={user.id} />
        <ImageGallery
          selected={selected}
          setSelected={setSelected}
          imageFilters={imageFilters}
        />
      </div>
      <FullscreenImageViewer />
    </>
  );
}
