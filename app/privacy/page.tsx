// 설계 문서 3.6 「개인정보처리방침」 (v0.13) — 구글 플레이에 적는 주소. 로그인 없이 열린다 (proxy.ts).
// 메뉴 줄 없이 글만. 내용이 바뀌면 설계 문서부터 고치고 시행일을 바꾼다.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 손끝 공방",
};

const 문의메일 = "birdwise77@gmail.com";

export default function 개인정보처리방침() {
  return (
    <main className="mx-auto max-w-[680px] px-6 py-12 text-[15px] leading-[1.8]">
      <h1 className="font-display text-[32px] font-bold">개인정보처리방침</h1>
      <p className="text-muted">손끝 공방 앱 · 시행일 2026년 10월 2일</p>

      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="mb-2 text-[18px] font-bold">1. 누가 처리하나요</h2>
          <p>손끝 공방(망원동)이 수강생 앱 「손끝 공방」에서 받은 정보를 처리합니다.</p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-bold">2. 어떤 정보를 왜 쓰나요</h2>
          <ul className="list-disc pl-5">
            <li>
              <b>이메일 주소</b> — 로그인할 때 6자리 코드를 보내고, 수강생 명단에 있는 분인지 확인합니다.
            </li>
            <li>
              <b>이름 · 연락처</b> — 공방이 수강생 명단에 미리 넣어 둔 것입니다. 앱은 신청할 때 본인 확인용으로 보여 줍니다.
            </li>
            <li>
              <b>클래스 신청 기록</b> — 어느 클래스를 신청 · 취소했는지. 자리를 잡고 공방이 오늘 오는 분을 보기 위해 씁니다.
            </li>
          </ul>
          <p className="mt-2">위치 · 연락처 목록 · 사진 같은 폰 안의 정보는 읽지 않습니다. 광고를 보여 주지 않습니다.</p>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-bold">3. 다른 곳에 주나요</h2>
          <p>판매하거나 다른 회사에 넘기지 않습니다. 앱을 돌리기 위해 아래 서비스에 맡겨 둡니다.</p>
          <ul className="list-disc pl-5">
            <li>Supabase — 명단 · 신청 기록 저장, 로그인</li>
            <li>Google Gmail — 로그인 코드 메일 보내기</li>
            <li>Vercel — 공방 관리 웹 운영</li>
          </ul>
          <p className="mt-2">주고받는 정보는 모두 암호화된 연결(HTTPS)로 오갑니다.</p>
        </section>

        <section id="delete">
          <h2 className="mb-2 text-[18px] font-bold">4. 얼마나 두나요 · 지우려면</h2>
          <p>수강생으로 계시는 동안 둡니다. 계정과 정보를 지우고 싶으시면 이렇게 해 주세요.</p>
          <ol className="mt-2 list-decimal pl-5">
            <li>
              <b>{문의메일}</b> 로 메일을 보냅니다. 제목은 「손끝 공방 계정 삭제 요청」.
            </li>
            <li>본문에 앱에 로그인하시던 이메일 주소를 적습니다.</li>
            <li>7일 안에 수강생 명단 · 로그인 계정 · 신청 기록을 모두 지우고 메일로 알려 드립니다. 그 뒤로는 앱에 로그인할 수 없습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-[18px] font-bold">5. 문의</h2>
          <p>
            <a href={`mailto:${문의메일}`} className="text-accent underline">
              {문의메일}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
