// lib/db/tags.ts

import { Tag } from '@prisma/client';

export async function fetchAllTags(): Promise<Tag[]> {
  const res = await fetch('/api/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function createTag(label: string): Promise<Tag> {
  const res = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) throw new Error('Failed to create tag');
  return res.json();
}

export async function addTagsToImages(
  imageIds: string[],
  tags: Tag[],
): Promise<{ success: boolean }> {
  const res = await fetch('/api/images/bulk-add-tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageIds, tags }),
  });
  if (!res.ok) throw new Error('Failed to tag images');
  return res.json();
}
