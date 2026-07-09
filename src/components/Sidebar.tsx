"use client";

import { useState } from "react";
import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";
import { useInvite } from "./InviteContext";

/**
 * 좌측 사이드바 — 가로폭에 따라 비례 축소.
 * 아이콘 열 너비: 60px(기본) → 72px(sm) → 85px(xl).
 * 알림 벨을 누르면 사이드바가 넓어지며(팝업 아님) 그 안에 "읽지 않은 알림" 리스트가 펼쳐진다.
 * 알림은 초대를 보낸 뒤에만 생긴다.
 */
export default function Sidebar() {
  const { invite } = useInvite();
  const [notifOpen, setNotifOpen] = useState(false);

  const count = invite?.participants.length ?? 0;

  return (
    <aside
      className={`flex h-full shrink-0 overflow-hidden border-r border-gray-400/40 bg-gray-00/70 transition-[width] duration-300 ease-out ${
        notifOpen ? "w-[380px]" : "w-[60px] sm:w-[72px] xl:w-[85px]"
      }`}
    >
      {/* 아이콘 열 */}
      <div className="flex w-[60px] shrink-0 flex-col items-center pt-[16px] sm:w-[72px] sm:pt-[20px] xl:w-[85px] xl:pt-[23px]">
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
          {/* 알림 */}
          <div className="relative">
            <button
              type="button"
              aria-label="알림"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((v) => !v)}
              className={`block transition-colors hover:text-carrot-600 ${
                notifOpen ? "text-carrot-600" : ""
              }`}
            >
              <BellIcon />
            </button>
            {/* 새 알림 점 — 초대를 보낸 뒤에만 표시 */}
            {invite && (
              <span className="pointer-events-none absolute -right-[2px] -top-[1px] size-[9px] rounded-full bg-[#ff6a60] ring-2 ring-gray-00" />
            )}
          </div>

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
      </div>

      {/* 알림 패널 — 사이드바가 넓어지며 인라인으로 표시 */}
      {notifOpen && (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto pt-[30px] pr-[14px]">
          <p className="pl-[4px] text-[24px] font-semibold leading-[1.4] tracking-[-0.5px] text-gray-1000">
            읽지 않은 알림 ({count})
          </p>

          {invite ? (
            <div className="mt-[14px] flex flex-col gap-[2px]">
              {invite.participants.map((name) => (
                <div
                  key={name}
                  className="flex flex-col gap-[10px] rounded-[22px] px-[14px] py-[18px] transition-colors hover:bg-gray-100/60"
                >
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center gap-[6px]">
                      <span className="size-[24px] shrink-0 rounded-full bg-gray-600" />
                      <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                        {name}
                      </span>
                      <span className="size-[8px] shrink-0 rounded-full bg-[#ff6a60]" />
                    </div>
                    <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                      ‘{invite.topic}’ 회의 일정을 선택했습니다.
                    </p>
                  </div>
                  <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                    {invite.dateLabel} {invite.recommendedTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-[16px] rounded-[18px] bg-gray-100/70 px-[16px] py-[24px] text-center text-[14px] font-medium leading-[1.5] tracking-[-0.5px] text-gray-600">
              새 알림이 없어요
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
