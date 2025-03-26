import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const publicRoutes = ["/sign-in", "/sign-up", "/"];

  const { pathname } = request.nextUrl;

  // if (
  //   !user &&
  //   (pathname.startsWith("/dashboard") || pathname.startsWith("/account-setup"))
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/sign-in";
  //   return NextResponse.redirect(url);
  // }

  if (user?.user_metadata?.is_new_user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/account-setup";
    return NextResponse.redirect(url);
  }

  // if (
  //   !user?.user_metadata?.is_new_user &&
  //   pathname.startsWith("/account-setup")
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/dashboard";
  //   return NextResponse.redirect(url);
  // }
  // if (user && publicRoutes.includes(pathname)) {
  //   // Authenticated users should not access public pages
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/dashboard";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}
