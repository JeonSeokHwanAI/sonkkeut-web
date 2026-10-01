// 주 넘기기 — 주간(3-3)과 클래스 만들기(3-3-1)가 같은 규칙을 쓴다 (설계 문서 v0.7.2 · v0.7.3)

// 뒤로는 4주 전까지, 앞으로는 제한 없다 (설계 문서 3-3)
export const 가장앞주 = -4;

const 날짜글 = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// 오늘이 든 주의 월요일에서 몇 주 옮긴 주의 7일
export function 그주날짜들(오늘: string, 몇주: number) {
  const 기준 = new Date(오늘 + "T00:00:00");
  const 월요일 = new Date(기준);
  월요일.setDate(기준.getDate() - ((기준.getDay() + 6) % 7) + 몇주 * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(월요일);
    d.setDate(월요일.getDate() + i);
    return 날짜글(d);
  });
}

// ?w= 를 읽는다 — 숫자가 아니면 이번 주, 4주 전보다 앞이면 4주 전
export function 몇주읽기(w: string | string[] | undefined) {
  const n = Number.parseInt(Array.isArray(w) ? w[0] : (w ?? "0"), 10);
  return Number.isNaN(n) ? 0 : Math.max(가장앞주, n);
}
