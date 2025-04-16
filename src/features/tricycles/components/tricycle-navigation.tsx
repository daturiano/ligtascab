'use client';

import { CarFront, FilePlus2, SquarePlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const data = {
  TricycleNav: [
    {
      title: 'Tricycles',
      url: '/tricycles',
      pathname: '/tricycles',
      icon: CarFront,
    },
    {
      title: 'Create Tricycle',
      url: '/create-tricycle',
      pathname: '/create-tricycle',
      icon: SquarePlus,
    },
    {
      title: 'Renew Tricycle',
      url: '/renew-tricycle',
      pathname: '/renew-tricycle',
      icon: FilePlus2,
    },
  ],
};

export default function TricycleNavigation() {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="w-full items-center flex gap-4">
      {data.TricycleNav.map((item) => {
        return (
          <Link
            key={item.title}
            href={item.url}
            className={`flex items-center gap-2 text-muted-foreground font-medium p-2 rounded-md ${
              path.startsWith(item.pathname) && 'bg-muted-foreground/10'
            }`}
          >
            {item.icon && (
              <item.icon
                size={20}
                className={`text-sm ${
                  path.startsWith(item.pathname) && 'text-black'
                }`}
              />
            )}
            <p
              className={`text-sm ${
                path.startsWith(item.pathname) && 'text-black'
              }`}
            >
              {item.title}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
