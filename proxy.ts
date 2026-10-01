// 설계 문서 3-1 「로그인」 (v0.8) — 로그인 안 했으면 어느 주소든 /login 으로 보낸다.
// ~~3-0 간단 잠금(브라우저 비밀번호 창)~~ → 뒤집음 (v0.8): 로그인으로 바꿨다.
// Next.js 16 에서는 middleware.ts 가 아니라 proxy.ts 다 (설계 문서 10장).

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { 주인인가 } from "@/lib/로그인";

export async function proxy(request: NextRequest) {
  let 응답 = NextResponse.next({ request });

  // 로그인 상태는 쿠키에 있다. 만료가 가까우면 창고가 새 쿠키를 주고, 그걸 응답에 실어 보낸다
  const 창고 = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (목록) => {
        목록.forEach(({ name, value }) => request.cookies.set(name, value));
        응답 = NextResponse.next({ request });
        목록.forEach(({ name, value, options }) => 응답.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await 창고.auth.getUser();
  const 들어옴 = 주인인가(user?.email); // 주인 메일만 (3-1)
  const 로그인화면 = request.nextUrl.pathname === "/login";

  const 보내기 = (주소: string) => {
    const 다른곳 = NextResponse.redirect(new URL(주소, request.url));
    응답.cookies.getAll().forEach((c) => 다른곳.cookies.set(c));
    return 다른곳;
  };

  if (!들어옴 && !로그인화면) return 보내기("/login");
  if (들어옴 && 로그인화면) return 보내기("/today"); // 로그인한 채로 /login (3-1)
  return 응답;
}

// 화면을 그리는 데 필요한 파일(글꼴 · 그림 · 스크립트)은 잠그지 않는다 — 잠그면 화면이 깨진다
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
