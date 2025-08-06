import { fetchAllTags } from '@/lib/db/tags';
import Qkey from '@/lib/queryKeys';
import { Tag } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import TagsFilter from './TagsFilter';

type Props = {
  selectedTagIds: Set<string>;
  setSelectedTagIds: (tagIds: Set<string>) => void;
};

export default function TagsFilterContainer({
  selectedTagIds,
  setSelectedTagIds,
}: Props) {
  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: [Qkey.UserTags],
    queryFn: fetchAllTags,
  });

  return (
    <TagsFilter
      selectedTagIds={Array.from(selectedTagIds)}
      allTags={allTags}
      onClose={(newSelectedTagIds) => {
        setSelectedTagIds(new Set(newSelectedTagIds));
      }}
    />
  );
}
