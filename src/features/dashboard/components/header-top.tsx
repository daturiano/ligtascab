import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/ui/logo';
import { createClient } from '@/supabase/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function HeaderTop() {
  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center">
        <a className="transition-all sm:block" href="/app">
          <div className="flex max-w-fit items-center gap-2">
            <Logo />
          </div>
        </a>
      </div>
      <div className="flex items-center space-x-6">
        <a href="#" className="text-sm sm:block" target="_blank">
          Help
        </a>
        <button
          onClick={() => {
            const supabase = createClient();
            supabase.auth.signOut();
            redirect('/sign-in');
          }}
          className="text-sm cursor-pointer sm:block"
        >
          Sign Out
        </button>
        <Link href="/settings" className="relative inline-block pt-1.5">
          <button className="group relative sm:inline-flex" type="button">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
              // src={user.image ?? undefined}
              // alt={user.first_name ?? undefined}
              />
              <AvatarFallback className="rounded-lg">
                <div className="size-10"></div>
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500"></div>
          </button>
        </Link>
      </div>
    </div>
  );
}
