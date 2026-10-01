// 설계 문서 3-3-1 「클래스 만들기」 (v0.7.3 · 4주차 27단계)
// 한 주 표에서 빈 칸마다 기본 클래스를 골라 한 번에 연다. 표 위 한 줄에서 기본 클래스를 더한다.
// 주 넘기기는 주간(3-3)과 같은 규칙 — 주소 ?w= · 뒤로 4주 전까지

import { connection } from "next/server";
import { 기본클래스읽기, 데이터읽기, 오늘구하기 } from "@/lib/데이터";
import { 가장앞주, 그주날짜들, 몇주읽기 } from "@/lib/주";
import type { 칸클래스 } from "../week/주간표";
import 만들기표 from "./만들기표";

export default async function 클래스만들기({ searchParams }: PageProps<"/new">) {
  await connection(); // 새로고침할 때마다 창고에서 새로 읽는다
  const 몇주 = 몇주읽기((await searchParams).w);
  const 오늘 = 오늘구하기();
  const [{ 클래스들, 살아있는신청 }, 기본클래스들] = await Promise.all([데이터읽기(), 기본클래스읽기()]);
  const 그주 = 그주날짜들(오늘, 몇주);
  const 처음클래스: 칸클래스[] = 클래스들
    .filter((c) => 그주.includes(c.날짜))
    .map((c) => ({ ...c, 신청수: 살아있는신청(c.id).length }));

  return (
    <div className="max-w-[1180px]">
      {/* key — 주를 넘기면 고르던 칸은 버린다 (3-3-1) */}
      <만들기표
        key={몇주}
        처음클래스={처음클래스}
        기본클래스들={기본클래스들}
        이번주={그주}
        오늘={오늘}
        몇주={몇주}
        앞으로못감={몇주 <= 가장앞주}
      />
    </div>
  );
}
