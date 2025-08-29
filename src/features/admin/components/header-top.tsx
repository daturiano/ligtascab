import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoWithName from "@/components/ui/logo-with-name";
import { createClient } from "@/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function HeaderTop() {
  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center">
        <div className="hidden transition-all sm:block">
          <div className="flex max-w-fit items-center gap-2">
            <LogoWithName />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {/* <ExpiryNotifications /> */}
        <a
          href="#"
          className="hidden text-sm text-slate-500 transition-colors hover:text-slate-700 sm:block"
          target="_blank"
        >
          Help
        </a>
        <button
          onClick={() => {
            const supabase = createClient();
            supabase.auth.signOut();
            redirect("/sign-in");
          }}
          className="hidden cursor-pointer text-sm text-slate-500 transition-colors hover:text-slate-700 sm:block"
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
            <div className="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500"></div>
          </button>
        </Link>
      </div>
    </div>
  );
}
