'use client';

import ImageUploadPanel from '../ImageUploadPanel';
import ImageGallery from '../ImageGallery';
import { useAtomValue } from 'jotai';
import userAtom from '@/lib/atoms/userAtom';
import FullscreenImageViewer from '../ImageGallery/FullScreenImageViewer';

export default function ReferenceManager() {
  const user = useAtomValue(userAtom);

  if (!user) return null;

  return (
    <>
      <div className={'relative p-8'}>
        <ImageUploadPanel userId={user.id} />
        <ImageGallery />
      </div>
      <FullscreenImageViewer />
    </>
  );
}
