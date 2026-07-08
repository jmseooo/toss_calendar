import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";

/**
 * 좌측 사이드바 — 가로폭에 따라 비례 축소.
 * 너비: 60px(기본) → 72px(sm) → 85px(xl).
 * 로고·아이콘 간격도 같은 브레이크포인트로 함께 줄어든다.
 * 로고 → 알림 / 검색 / 채팅 아이콘.
 */
export default function Sidebar() {
  return (
    <aside className="flex w-[60px] shrink-0 flex-col items-center border-r border-gray-400/40 bg-gray-00/70 pt-[16px] sm:w-[72px] sm:pt-[20px] xl:w-[85px] xl:pt-[23px]">
      {/* 로고 */}
      <Image
        src="/logo-v2.png"
        alt="로고"
        width={60}
        height={60}
        priority
        className="size-[40px] sm:size-[50px] xl:size-[60px]"
      />

      {/* 네비게이션 아이콘 */}
      <nav className="mt-[40px] flex flex-col items-center gap-[24px] text-gray-1000 sm:mt-[50px] sm:gap-[30px] xl:mt-[61px] xl:gap-[36px]">
        <button
          type="button"
          aria-label="알림"
          className="transition-colors hover:text-carrot-600"
        >
          <BellIcon />
        </button>
        <button
          type="button"
          aria-label="검색"
          className="transition-colors hover:text-carrot-600"
        >
          <SearchIcon />
        </button>
        <button
          type="button"
          aria-label="채팅"
          className="transition-colors hover:text-carrot-600"
        >
          <ChatIcon />
        </button>
      </nav>
    </aside>
  );
}
