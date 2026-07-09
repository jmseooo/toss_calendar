"use client";

import { useState } from "react";
import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";
import { useInvite } from "./InviteContext";

/**
 * 좌측 사이드바 — 가로폭에 따라 비례 축소.
 * 너비: 60px(기본) → 72px(sm) → 85px(xl).
 * 로고 → 알림 / 검색 / 채팅 아이콘.
 * 초대를 보낸 뒤에만 알림 벨에 점이 찍히고, 누르면 "참석자 답장" 알림 패널이 열린다.
 */
export default function Sidebar() {
  const { invite } = useInvite();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <aside className="relative flex w-[60px] shrink-0 flex-col items-center border-r border-gray-400/40 bg-gray-00/70 pt-[16px] sm:w-[72px] sm:pt-[20px] xl:w-[85px] xl:pt-[23px]">
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
            className="block transition-colors hover:text-carrot-600"
          >
            <BellIcon />
          </button>
          {/* 새 알림 점 — 초대를 보낸 뒤에만 표시 */}
          {invite && (
            <span className="pointer-events-none absolute -right-[2px] -top-[1px] size-[9px] rounded-full bg-[#ff6a60] ring-2 ring-gray-00" />
          )}

          {/* 알림 패널 */}
          {notifOpen && (
            <>
              {/* 바깥 클릭 시 닫기 */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute left-[calc(100%+16px)] top-[-12px] z-50 w-[340px] rounded-[24px] bg-white p-[20px] shadow-[0px_2px_40px_0px_rgba(0,0,0,0.16)]">
                <p className="text-[15px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-1000">
                  알림
                </p>

                {invite ? (
                  <div className="mt-[14px] flex gap-[13px] rounded-[18px] bg-gray-100/70 p-[16px]">
                    {/* 답장한 참석자 아바타 클러스터 */}
                    <div className="flex shrink-0 -space-x-[10px] pt-[2px]">
                      {invite.participants.slice(0, 3).map((n) => (
                        <span
                          key={n}
                          className="size-[32px] shrink-0 rounded-full bg-gray-600 ring-2 ring-white"
                        />
                      ))}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold leading-[1.4] tracking-[-0.5px] text-gray-1000">
                        필수 참석자 {invite.participants.length}명이 답장했어요
                      </p>
                      <p className="mt-[2px] text-[13px] font-medium leading-[1.4] tracking-[-0.5px] text-gray-700">
                        {invite.topic} · {invite.dateLabel}
                      </p>

                      {/* 가장 많이 겹친 추천 시간 */}
                      {invite.recommendedTime && (
                        <div
                          className="mt-[10px] rounded-[14px] px-[14px] py-[10px]"
                          style={{
                            backgroundImage:
                              "linear-gradient(98.95deg, #ffe8db 1.5%, #fff8dd 96.5%)",
                          }}
                        >
                          <p className="text-[12px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600">
                            가장 많이 겹친 시간
                          </p>
                          <p className="mt-[2px] text-[15px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-1000">
                            {invite.dateLabel} · {invite.recommendedTime}
                          </p>
                        </div>
                      )}

                      <p className="mt-[8px] text-[12px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-600">
                        방금 전
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-[14px] rounded-[18px] bg-gray-100/70 px-[16px] py-[24px] text-center text-[14px] font-medium leading-[1.5] tracking-[-0.5px] text-gray-600">
                    새 알림이 없어요
                  </p>
                )}
              </div>
            </>
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
    </aside>
  );
}
