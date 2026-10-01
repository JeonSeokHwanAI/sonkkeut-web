"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 로그인창고 } from "@/lib/로그인";

// 설계 문서 3장 — 왼쪽 메뉴 줄. 지금 있는 화면이 강조색으로 칠해진다
// 맨 아래 — 로그인한 메일 + [로그아웃] (v0.8 · A안). 누르면 묻지 않고 /login
const 메뉴 = [
  { 이름: "오늘 클래스", 주소: "/today" },
  { 이름: "주간", 주소: "/week" },
  { 이름: "클래스 만들기", 주소: "/new" }, // 3-3-1 (v0.7.3)
  { 이름: "알림판", 주소: "/notice" },
];

export default function 메뉴줄({ 메일 }: { 메일: string }) {
  const 지금주소 = usePathname();
  const router = useRouter();

  const 로그아웃 = async () => {
    await 로그인창고().auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 flex h-screen w-[180px] shrink-0 flex-col border-r border-line bg-card px-3 py-5">
      <p className="mb-5 px-2 font-display text-[20px] font-bold">손끝 공방</p>
      {메뉴.map((m) => {
        const 지금화면 = 지금주소 === m.주소;
        return (
          <Link
            key={m.주소}
            href={m.주소}
            className={
              "mb-1 block rounded-lg px-3 py-2 text-[15px] " +
              (지금화면 ? "bg-accent font-medium text-white" : "text-muted hover:bg-bg")
            }
          >
            {m.이름}
          </Link>
        );
      })}
      <div className="mt-auto grid gap-0.5 border-t border-line px-3 pt-3">
        <span className="truncate text-[13px] text-muted" title={메일}>
          {메일}
        </span>
        <button onClick={로그아웃} className="justify-self-start text-[15px] text-accent hover:underline">
          로그아웃
        </button>
      </div>
    </nav>
  );
}
