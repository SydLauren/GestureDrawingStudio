'use client';

import { useState } from 'react';
import { TagDropdown } from './TagDropdown';

const dummyTags = [
  { id: '1', name: 'Figure' },
  { id: '2', name: 'Hands' },
  { id: '3', name: 'Animals' },
  { id: '4', name: 'Portrait' },
];

export default function TagDropdownDemo() {
  const [selected, setSelected] = useState<string[]>(['1']);

  const toggleTag = (tagId: string) => {
    setSelected((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  return (
    <div className="p-6">
      <TagDropdown
        allTags={dummyTags}
        selectedTagIds={selected}
        onToggle={toggleTag}
        onCreateNewTag={() => {}}
      />
    </div>
  );
}
