"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 창고, type 기본클래스 } from "@/lib/데이터";
import {
  type 칸클래스,
  요일글,
  기본시간줄,
  정원최소,
  정원최대,
  처음정원,
  처음걸리는시간,
  걸리는시간목록,
  시간글,
  날짜보기,
} from "../week/주간표";

// 설계 문서 3-3-1 「클래스 만들기」 — A 칸마다 고르기 (v0.7.3)
// 빈 칸마다 기본 클래스를 고르고 [만들기] 로 한 번에 연다.

const 정원목록 = Array.from({ length: 정원최대 - 정원최소 + 1 }, (_, i) => 정원최소 + i);
const 칸이름 = (날짜: string, 시각: string) => `${날짜}|${시각}`;

export default function 만들기표({
  처음클래스,
  기본클래스들,
  이번주,
  오늘,
  몇주,
  앞으로못감,
}: {
  처음클래스: 칸클래스[];
  기본클래스들: 기본클래스[];
  이번주: string[]; // 지금 보고 있는 주의 7일
  오늘: string;
  몇주: number; // 0 = 이번 주, 1 = 다음 주, -1 = 지난주
  앞으로못감: boolean; // 4주 전 — [‹] 가 흐리다
}) {
  // 표는 늘 창고에서 온 것을 그린다 — 실시간으로 다시 읽으면 바로 바뀐다 (설계 문서 10장)
  const 클래스들 = 처음클래스;
  const router = useRouter();
  // 고른 칸 — 칸이름 → 기본 클래스 id. 아직 저장 전
  const [고름, 고름바꾸기] = useState<Record<string, number>>({});
  const [만드는중, 만드는중바꾸기] = useState(false);
  const [알림, 알림바꾸기] = useState("");
  const [새것, 새것바꾸기] = useState({ 이름: "", 걸리는시간: 처음걸리는시간, 정원: 처음정원 });
  const [더하기막힘, 더하기막힘바꾸기] = useState("");

  const 시간줄 = [...new Set([...기본시간줄, ...클래스들.map((c) => c.시작)])].sort();
  const 지난날 = (날짜: string) => 날짜 < 오늘;
  const 주소 = (n: number) => (n === 0 ? "/new" : `/new?w=${n}`);
  const 기본클래스찾기 = (id: number) => 기본클래스들.find((t) => t.id === id);

  // 열린 칸 · 지난 날 칸은 고를 수 없다 — 실시간으로 그사이 열린 칸은 고름에서 빠진다
  const 고른칸들 = Object.entries(고름)
    .map(([칸, id]) => {
      const [날짜, 시작] = 칸.split("|");
      return { 날짜, 시작, 기본: 기본클래스찾기(id) };
    })
    .filter(
      (c): c is { 날짜: string; 시작: string; 기본: 기본클래스 } =>
        !!c.기본 && !지난날(c.날짜) && !클래스들.some((k) => k.날짜 === c.날짜 && k.시작 === c.시작)
    );

  const 고르기 = (날짜: string, 시각: string, 값: string) => {
    알림바꾸기("");
    고름바꾸기((앞) => {
      const 다음 = { ...앞 };
      if (값 === "") delete 다음[칸이름(날짜, 시각)];
      else 다음[칸이름(날짜, 시각)] = Number(값);
      return 다음;
    });
  };

  const 만들기 = async () => {
    if (고른칸들.length === 0 || 만드는중) return;
    만드는중바꾸기(true);
    // 칸마다 넣는다 — 그사이 다른 곳에서 같은 칸이 열렸으면(23505) 그 칸만 뺀다
    const 결과 = await Promise.all(
      고른칸들.map(async (c) => {
        const { error } = await 창고.from("classes").insert({
          date: c.날짜,
          start_time: c.시작,
          minutes: c.기본.걸리는시간, // 열 때 값을 옮겨 적는다 (4장)
          name: c.기본.이름,
          capacity: c.기본.정원,
        });
        return { ...c, 됨: !error, 겹침: error?.code === "23505" };
      })
    );
    const 연수 = 결과.filter((r) => r.됨).length;
    const 뺀칸 = 결과.filter((r) => r.겹침).map((r) => `${날짜보기(r.날짜)} ${r.시작}`);
    const 실패 = 결과.some((r) => !r.됨 && !r.겹침);

    let 말 = `${연수}개를 열었습니다`;
    if (뺀칸.length > 0) 말 += `. ${뺀칸.join(", ")} 는 이미 클래스가 있어 뺐습니다`;
    if (실패) 말 += ". 저장하지 못한 칸이 있습니다. 잠시 뒤 다시 눌러 주세요";
    // 연 칸 · 뺀 칸은 고름에서 지운다 — 저장 못 한 칸만 남겨 다시 누를 수 있게
    고름바꾸기((앞) => {
      const 다음 = { ...앞 };
      for (const r of 결과) if (r.됨 || r.겹침) delete 다음[칸이름(r.날짜, r.시작)];
      return 다음;
    });
    알림바꾸기(말);
    만드는중바꾸기(false);
    router.refresh(); // 방금 연 것을 창고에서 다시 읽어 그린다
  };

  const 더하기 = async () => {
    const 이름 = 새것.이름.trim();
    if (이름 === "") return 더하기막힘바꾸기("기본 클래스 이름을 적어주세요");
    if (새것.정원 < 정원최소 || 새것.정원 > 정원최대)
      return 더하기막힘바꾸기(`정원은 ${정원최소}~${정원최대}명입니다`);
    if (기본클래스들.some((t) => t.이름 === 이름)) return 더하기막힘바꾸기("이미 있는 기본 클래스입니다");

    const { error } = await 창고
      .from("class_templates")
      .insert({ name: 이름, minutes: 새것.걸리는시간, capacity: 새것.정원 });
    if (error) {
      if (error.code === "23505") return 더하기막힘바꾸기("이미 있는 기본 클래스입니다");
      return 더하기막힘바꾸기("저장하지 못했습니다. 잠시 뒤 다시 눌러 주세요");
    }
    더하기막힘바꾸기("");
    새것바꾸기({ 이름: "", 걸리는시간: 처음걸리는시간, 정원: 처음정원 });
    router.refresh(); // 목록에 생기고 바로 고를 수 있다
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="font-display text-[20px] font-bold">클래스 만들기</h1>
        <p className="flex items-center gap-2 text-[13px] text-muted tabular-nums">
          {날짜보기(이번주[0])} — {날짜보기(이번주[6])}
          {앞으로못감 ? (
            <span aria-disabled className="rounded px-1 text-[15px] text-line">‹</span>
          ) : (
            <Link href={주소(몇주 - 1)} aria-label="지난주" className="rounded px-1 text-[15px] text-accent hover:bg-bg">
              ‹
            </Link>
          )}
          <Link href={주소(몇주 + 1)} aria-label="다음 주" className="rounded px-1 text-[15px] text-accent hover:bg-bg">
            ›
          </Link>
        </p>
      </div>

      {/* 기본 클래스 줄 — 알약 + 줄 끝 더하기 칸 */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px]">
        <span className="text-muted">기본 클래스</span>
        {기본클래스들.map((t) => (
          <span key={t.id} className="rounded-full border border-line bg-card px-3 py-1">
            {t.이름}{" "}
            <span className="text-muted tabular-nums">
              {시간글(t.걸리는시간)}·{t.정원}명
            </span>
          </span>
        ))}
        <span className="flex flex-wrap items-center gap-1 rounded-full border border-dashed border-accent px-2 py-0.5">
          <span className="text-accent">＋</span>
          <input
            value={새것.이름}
            onChange={(e) => 새것바꾸기({ ...새것, 이름: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && 더하기()}
            placeholder="이름"
            aria-label="기본 클래스 이름"
            className="w-[110px] bg-transparent px-1 py-0.5 placeholder:text-muted focus:outline-none"
          />
          <select
            value={새것.걸리는시간}
            onChange={(e) => 새것바꾸기({ ...새것, 걸리는시간: Number(e.target.value) })}
            aria-label="걸리는 시간"
            className="rounded border border-line bg-card px-1 py-0.5"
          >
            {걸리는시간목록.map((분) => (
              <option key={분} value={분}>
                {분}분
              </option>
            ))}
          </select>
          <select
            value={새것.정원}
            onChange={(e) => 새것바꾸기({ ...새것, 정원: Number(e.target.value) })}
            aria-label="정원"
            className="rounded border border-line bg-card px-1 py-0.5"
          >
            {정원목록.map((n) => (
              <option key={n} value={n}>
                {n}명
              </option>
            ))}
          </select>
          <button onClick={더하기} className="rounded-full bg-accent px-3 py-0.5 font-medium text-white">
            더하기
          </button>
        </span>
      </div>
      {더하기막힘 && <p className="-mt-2 mb-3 text-[13px] text-cancel-pill">{더하기막힘}</p>}
      {기본클래스들.length === 0 && (
        <p className="mb-3 text-[13px] text-muted">먼저 기본 클래스를 하나 더해 주세요</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse overflow-hidden rounded-xl border border-line bg-card text-[13px]">
          <thead>
            <tr className="bg-bg text-muted">
              <th className="w-[70px] border border-line px-2 py-2 font-medium">　</th>
              {이번주.map((날짜, i) => (
                <th key={날짜} className="border border-line px-2 py-2 font-medium tabular-nums">
                  {요일글[i]} {Number(날짜.split("-")[2])}
                  {날짜 === 오늘 && <span className="ml-1 text-accent">· 오늘</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {시간줄.map((시각) => (
              <tr key={시각}>
                <td className="border border-line bg-bg px-2 py-2 text-right text-muted tabular-nums">
                  {시각}
                </td>
                {이번주.map((날짜) => {
                  // 이미 열린 칸 — 보이기만 하고 고를 수 없다 (한 칸에 하나 · 5장)
                  const 수업 = 클래스들.find((c) => c.날짜 === 날짜 && c.시작 === 시각);
                  if (수업) {
                    const 마감 = 수업.신청수 >= 수업.정원;
                    return (
                      <td key={날짜} className="h-[54px] border border-line p-1 align-top">
                        <div
                          className={
                            "rounded-md px-2 py-1 leading-tight " +
                            (마감 || 지난날(날짜) ? "bg-line text-muted" : "bg-accent text-white")
                          }
                        >
                          <span className="block">{수업.이름}</span>
                          <span className="tabular-nums">
                            {마감 ? "마감" : `${수업.신청수}/${수업.정원}`}
                          </span>
                        </div>
                      </td>
                    );
                  }
                  if (지난날(날짜))
                    return <td key={날짜} className="h-[54px] border border-line bg-bg/60" />;

                  // 빈 칸 — 고르는 칸. 고르면 연한 강조색 + 점선 강조색 테두리 (저장 전)
                  const 고른것 = 기본클래스찾기(고름[칸이름(날짜, 시각)]);
                  return (
                    <td key={날짜} className="h-[54px] border border-line p-1">
                      <div
                        className={
                          "relative flex h-[44px] flex-col justify-center rounded-md border border-dashed px-2 leading-tight " +
                          (고른것 ? "border-accent bg-accent/10" : "border-line text-muted hover:bg-bg")
                        }
                      >
                        {고른것 ? (
                          <>
                            <span className="block text-accent">{고른것.이름} ▾</span>
                            <span className="text-[12px] text-muted tabular-nums">
                              {시간글(고른것.걸리는시간)}·{고른것.정원}명
                            </span>
                          </>
                        ) : (
                          <span className="text-center">＋ ▾</span>
                        )}
                        <select
                          value={고른것 ? String(고른것.id) : ""}
                          onChange={(e) => 고르기(날짜, 시각, e.target.value)}
                          disabled={기본클래스들.length === 0}
                          aria-label={`${날짜보기(날짜)} ${시각} 기본 클래스 고르기`}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
                        >
                          <option value="">＋ (비우기)</option>
                          {기본클래스들.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.이름} · {시간글(t.걸리는시간)} · {t.정원}명
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-[13px] text-muted tabular-nums">고른 칸 {고른칸들.length}개</p>
        <button
          onClick={만들기}
          disabled={고른칸들.length === 0 || 만드는중}
          className="rounded-lg bg-accent px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40"
        >
          {고른칸들.length > 0 ? `${고른칸들.length}개 만들기` : "만들기"}
        </button>
      </div>
      {알림 && <p className="mt-2 text-right text-[13px] text-accent">{알림}</p>}
    </>
  );
}
