// 설계 문서 3-3 「주간」
//   1바퀴 — 표 틀
//   2바퀴 — 빈 칸을 눌러 클래스 열기 (주간표.tsx)
//   4주차 26단계 — [‹] [›] 주 넘기기 (v0.7.2). 보는 주는 주소 ?w= 에 남긴다
// 고치기 · 지우기는 다음 바퀴.

import { connection } from "next/server";
import { 데이터읽기, 오늘구하기 } from "@/lib/데이터";
import { 가장앞주, 그주날짜들, 몇주읽기 } from "@/lib/주";
import 주간표, { type 칸클래스 } from "./주간표";

export default async function 주간({ searchParams }: PageProps<"/week">) {
  await connection(); // 새로고침할 때마다 창고에서 새로 읽는다
  const 몇주 = 몇주읽기((await searchParams).w);
  const 오늘 = 오늘구하기();
  const { 클래스들, 살아있는신청 } = await 데이터읽기();
  const 그주 = 그주날짜들(오늘, 몇주);
  const 처음클래스: 칸클래스[] = 클래스들
    .filter((c) => 그주.includes(c.날짜))
    .map((c) => ({ ...c, 신청수: 살아있는신청(c.id).length }));

  return (
    <div className="max-w-[1180px]">
      <주간표
        처음클래스={처음클래스}
        이번주={그주}
        오늘={오늘}
        몇주={몇주}
        앞으로못감={몇주 <= 가장앞주}
      />
    </div>
  );
}
