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
  const isPathMatch = (substring: string): boolean => {
    return pathname.toLowerCase().includes(substring.toLowerCase());
  };

  return (
    <div className="w-full items-center flex gap-4">
      {data.map((item) => {
        return (
          <Link
            key={item.title}
            href={item.url}
            className={`flex items-center gap-2 text-muted-foreground font-medium p-2 rounded-md ${
              isPathMatch(item.pathname) && 'bg-muted-foreground/10'
            }`}
          >
            {item.icon && (
              <item.icon
                size={20}
                className={`text-sm ${
                  isPathMatch(item.pathname) && 'text-black'
                }`}
              />
            )}
            <p
              className={`text-sm ${
                isPathMatch(item.pathname) && 'text-black'
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
