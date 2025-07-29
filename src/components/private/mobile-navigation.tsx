import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { navData } from '@/components/private/navigation';

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <AlignJustify size={20} />
      </SheetTrigger>
      <SheetContent side="left" className="max-w-screen min-w-screen">
        <SheetTitle />
        <div className="flex flex-col items-start py-24 px-12 gap-10 min-h-screen">
          {navData.navMain.map((item) => {
            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`cursor-pointer whitespace-nowrap flex items-center justify-center gap-2
                `}
              >
                <item.icon size={24} />
                <p className="text-lg font-medium">{item.title}</p>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
