'use client';

import { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavItem = {
  title: string;
  url: string;
  pathname: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
};

type InnerNavigationProps = {
  data: NavItem[];
};

export default function SecondaryNavigation({ data }: InnerNavigationProps) {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="w-full items-center flex gap-4 lg:px-20 max-w-screen-2xl mx-auto">
      {data.map((item) => {
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
