'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '../actions/authentication';

export default function NavigationBar() {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-4 lg:px-6 lg:pt-6 flex justify-between items-center">
      <p className="font-nunito font-extrabold tracking-tighter text-2xl lg:text-4xl">
        ligtascab.
      </p>
      <div className="flex items-center gap-2">
        {path === '/sign-up' && (
          <div className="flex items-center gap-2">
            <p className="hidden lg:block">Already have an account?</p>
            <Button onClick={() => router.push('/sign-in')} variant={'outline'}>
              Log in
            </Button>
          </div>
        )}
        {path === '/account-setup' && (
          <Button onClick={signOut} variant={'outline'}>
            Log out
          </Button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
