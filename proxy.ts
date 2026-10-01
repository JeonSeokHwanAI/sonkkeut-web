// 설계 문서 3-0 「간단 잠금」 (v0.7)
// 웹 전체를 비밀번호 하나로 잠근다 — 브라우저가 띄우는 창이 묻는다.
// 비밀번호는 코드에 적지 않는다. 열쇠 파일(.env.local)과 Vercel 설정의 OWNER_PASSWORD 에만 둔다.
// Next.js 16 에서는 middleware.ts 가 아니라 proxy.ts 다 (설계 문서 10장).

import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const 비밀번호 = process.env.OWNER_PASSWORD;
  const 머리 = request.headers.get("authorization") ?? "";

  // 비밀번호를 안 정했으면 아무도 못 들어온다 — 잠금을 까먹고 올려도 열린 채로 올라가지 않게
  if (비밀번호 && 머리.startsWith("Basic ")) {
    // "사용자이름:비밀번호" — 사용자 이름은 아무거나. 첫 ":" 뒤가 비밀번호다
    const 풀어낸것 = atob(머리.slice("Basic ".length));
    const 넣은비밀번호 = 풀어낸것.slice(풀어낸것.indexOf(":") + 1);
    if (넣은비밀번호 === 비밀번호) return NextResponse.next();
  }

  return new NextResponse("비밀번호가 필요합니다", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="sonkkeut", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

// 화면을 그리는 데 필요한 파일(글꼴 · 그림 · 스크립트)은 잠그지 않는다 — 잠그면 화면이 깨진다
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
