import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";

/**
 * 좌측 고정 사이드바 (85px).
 * 로고 → 알림 / 검색 / 채팅 아이콘.
 */
export default function Sidebar() {
  return (
    <aside className="flex w-[85px] shrink-0 flex-col items-center border-r border-gray-400/40 bg-gray-00/70 pt-[23px]">
      {/* 로고 */}
      <Image
        src="/logo.png"
        alt="로고"
        width={60}
        height={60}
        priority
        className="size-[60px]"
      />

      {/* 네비게이션 아이콘 */}
      <nav className="mt-[61px] flex flex-col items-center gap-[36px] text-gray-1000">
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
