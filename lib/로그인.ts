// 설계 문서 3-1 「로그인」 (v0.8)
// 주인 계정은 하나. 창고의 공개 열쇠로는 누구나 계정을 만들 수 있어서, 웹은 이 메일로 로그인한 사람만 들인다.
// 비밀번호는 여기 적지 않는다 — 창고(Supabase)에만 있다.

import { createBrowserClient } from "@supabase/ssr";

export const 주인메일 = "owner@sonkkeut.kr";

export const 주인인가 = (메일: string | null | undefined) => 메일 === 주인메일;

// 브라우저에서 로그인 · 로그아웃할 때 쓰는 창고 — 로그인 상태를 쿠키에 적어 서버(proxy)도 알게 한다
export const 로그인창고 = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);
