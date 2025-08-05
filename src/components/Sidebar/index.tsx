'use client';

import { Pen, Images } from 'lucide-react';
import Flex from '../ui/Flex';
import Link from 'next/link';

enum PAGE {
  studio = 'studio',
  gallery = 'gallery',
}
const pages = [PAGE.studio, PAGE.gallery];

const pageMetadata = {
  [PAGE.studio]: {
    icon: Pen,
    displayName: 'Drawing Session',
    path: '/studio/session-builder',
  },
  [PAGE.gallery]: {
    icon: Images,
    displayName: 'Reference Library',
    path: '/studio/references',
  },
};

export default function Sidebar() {
  return (
    <aside className="flex h-20 w-full items-center bg-muted md:h-full md:w-64 md:flex-col md:items-start">
      {pages.map((page) => {
        const Icon = pageMetadata[page].icon;
        return (
          <Flex
            key={page}
            className="h-7 w-full cursor-pointer p-4 hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4" />
              <Link href={`${pageMetadata[page].path}`}>
                {pageMetadata[page].displayName}
              </Link>
            </div>
          </Flex>
        );
      })}
    </aside>
  );
}
