import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicRoutes = ["/sign-in", "/sign-up", "/"];
  const privateRoutes = [
    "/account-setup",
    "/tricycles",
    "/create-tricycle",
    "/renew-tricycle",
    "/home",
  ];

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from private routes
  if (!user && privateRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // FIXED: Allow officers to access any admin route (not just /admin exactly)
  if (user?.role === "officer" && !pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Redirect non-officers away from admin routes
  if (user?.role !== "officer" && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect new users to account setup
  if (user?.user_metadata?.is_new_user && pathname.startsWith("/home")) {
    const url = request.nextUrl.clone();
    url.pathname = "/account-setup";
    return NextResponse.redirect(url);
  }

  // Redirect existing users away from account setup
  if (
    !user?.user_metadata?.is_new_user &&
    pathname.startsWith("/account-setup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from public routes
  if (user && publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
