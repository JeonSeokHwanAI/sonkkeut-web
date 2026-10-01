// 로그인한 뒤의 화면들 — 왼쪽 메뉴 줄 + 실시간 (설계 문서 3장 웹 공통)
// 로그인 확인은 proxy.ts 가 한다. 여기서는 메뉴 줄 맨 아래에 보일 메일만 읽는다 (v0.8)

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import 메뉴줄 from "./메뉴줄";
import 실시간 from "./실시간";

export default async function 관리화면({ children }: { children: React.ReactNode }) {
  const 쿠키 = await cookies();
  const 창고 = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
    cookies: { getAll: () => 쿠키.getAll(), setAll: () => {} }, // 쿠키 새로 쓰기는 proxy 몫
  });
  const {
    data: { user },
  } = await 창고.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <메뉴줄 메일={user?.email ?? ""} />
      <실시간 />
      <main className="min-w-0 flex-1 px-8 py-6">{children}</main>
    </div>
  );
}
