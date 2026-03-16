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

  // --- Super Admin Route Protection ---
  // Allow access to super-admin login without auth
  if (!user && pathname === "/super-admin/login") {
    return supabaseResponse;
  }

  // Redirect unauthenticated users from super-admin routes to login
  if (!user && pathname.startsWith("/super-admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/super-admin/login";
    return NextResponse.redirect(url);
  }

  // Redirect super_admin users to their dashboard from non-super-admin routes
  if (
    user?.user_metadata?.role === "super_admin" &&
    !pathname.startsWith("/super-admin")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/super-admin/dashboard";
    return NextResponse.redirect(url);
  }

  // Block non-super-admin users from super-admin routes
  if (
    user &&
    user.user_metadata?.role !== "super_admin" &&
    pathname.startsWith("/super-admin")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // --- Authority Route Protection ---
  if (
    user?.user_metadata?.role === "authority" &&
    !pathname.startsWith("/authority")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/authority/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow access to authority login page without auth
  if (!user && pathname === "/authority/login") {
    return supabaseResponse;
  }

  // Redirect unauthenticated users from authority dashboard to login
  if (!user && pathname.startsWith("/authority")) {
    const url = request.nextUrl.clone();
    url.pathname = "/authority/login";
    return NextResponse.redirect(url);
  }

  // Redirect non-authority users away from authority routes
  if (
    user &&
    user.user_metadata?.role !== "authority" &&
    pathname.startsWith("/authority")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
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
