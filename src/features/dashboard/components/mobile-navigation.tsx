import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { navData } from './dashboard-header';
import { useState } from 'react';

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <AlignJustify size={20} />
      </SheetTrigger>
      <SheetContent side="left" className="max-w-screen min-w-screen">
        <SheetDescription className="flex flex-col items-start py-24 px-12 gap-10 min-h-screen">
          {navData.navMain.map((item) => {
            const title =
              item.title.charAt(0).toUpperCase() + item.title.slice(1);
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`cursor-pointer whitespace-nowrap flex items-center justify-center gap-2
              `}
              >
                {<item.icon size={24} />}
                <p className={`text-lg font-medium`}>{title}</p>
              </Link>
            );
          })}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
