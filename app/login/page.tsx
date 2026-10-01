"use client";

// 설계 문서 3-1 「로그인」 — B 좌우 스플릿 (v0.8)
// 왼쪽 강조색 면에 상호 + 한 줄 소개, 오른쪽에 이메일 · 비밀번호 · [로그인]. 메뉴 줄은 없다.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 로그인창고, 주인인가 } from "@/lib/로그인";

const 틀림 = "이메일이나 비밀번호가 맞지 않습니다";

export default function 로그인() {
  const router = useRouter();
  const [메일, 메일바꾸기] = useState("");
  const [비밀번호, 비밀번호바꾸기] = useState("");
  const [막힘, 막힘바꾸기] = useState("");
  const [누르는중, 누르는중바꾸기] = useState(false);

  const 로그인하기 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (메일.trim() === "" || 비밀번호 === "") return 막힘바꾸기("이메일과 비밀번호를 적어주세요");
    누르는중바꾸기(true);
    막힘바꾸기("");

    const 창고 = 로그인창고();
    const { data, error } = await 창고.auth.signInWithPassword({ email: 메일.trim(), password: 비밀번호 });
    // 주인 메일이 아닌 계정은 비밀번호가 맞아도 들이지 않는다 (3-1)
    if (error || !주인인가(data.user?.email)) {
      if (!error) await 창고.auth.signOut();
      누르는중바꾸기(false);
      return 막힘바꾸기(틀림);
    }
    router.replace("/today");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-col justify-center gap-3 bg-accent px-10 py-12 text-white md:w-[56%] md:px-16">
        <h1 className="font-display text-[44px] font-bold leading-tight">손끝 공방</h1>
        <p className="text-[20px] leading-snug text-white/80">
          주말에 한 번,
          <br />
          손으로 만드는 하루
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-bg px-6 py-12">
        <form onSubmit={로그인하기} noValidate className="grid w-full max-w-[360px] gap-3">
          <div>
            <h2 className="font-display text-[24px] font-bold">로그인</h2>
            <p className="text-[13px] text-muted">관리하시는 분만 들어옵니다</p>
          </div>
          <label htmlFor="로그인-메일" className="sr-only">
            이메일
          </label>
          <input
            id="로그인-메일"
            type="email"
            autoComplete="username"
            value={메일}
            onChange={(e) => 메일바꾸기(e.target.value)}
            placeholder="owner@sonkkeut.kr"
            className="mt-2 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[15px] placeholder:text-muted"
          />
          <label htmlFor="로그인-비밀번호" className="sr-only">
            비밀번호
          </label>
          <input
            id="로그인-비밀번호"
            type="password"
            autoComplete="current-password"
            value={비밀번호}
            onChange={(e) => 비밀번호바꾸기(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[15px] placeholder:text-muted"
          />
          {/* 틀렸을 때 — 버튼 위에 한 줄 (3-1) */}
          {막힘 && <p className="text-[13px] text-cancel-pill">{막힘}</p>}
          <button
            type="submit"
            disabled={누르는중}
            className="w-full rounded-lg bg-accent py-2.5 text-[15px] font-medium text-white disabled:opacity-50"
          >
            {누르는중 ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </section>
    </div>
  );
}
