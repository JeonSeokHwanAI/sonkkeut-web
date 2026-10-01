import type { Metadata } from "next";
import { Noto_Sans_KR, Gowun_Dodum } from "next/font/google";
import "./globals.css";

// 메뉴 줄은 (owner)/layout.tsx 에만 있다 — 로그인 화면에는 없다 (설계 문서 3-1 · v0.8)

const 본문글꼴 = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const 제목글꼴 = Gowun_Dodum({
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "손끝 공방 — 클래스 예약 관리",
  description: "공방 원데이 클래스를 신청받고 오늘 누가 오는지 본다",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${본문글꼴.variable} ${제목글꼴.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
