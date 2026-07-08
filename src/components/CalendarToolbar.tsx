"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutMonthIcon,
  LayoutWeekIcon,
  PlusIcon,
} from "./icons";
import { VIEW_YEAR, VIEW_MONTH } from "@/lib/calendar";

/**
 * 캘린더 상단 툴바.
 * 제목 · 이전/다음 · 오늘 · 뷰 토글 · "일정 생성하기".
 * (현재는 시안 재현 단계라 이전/다음 등은 시각적 상태만 처리)
 */
export default function CalendarToolbar() {
  const [view, setView] = useState<"month" | "week">("month");

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-y-[12px]">
      <div className="flex flex-wrap items-center gap-[18px] gap-y-[10px]">
        {/* 월 제목 + 이동 화살표 */}
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[24px] font-semibold leading-[1.6] text-gray-1000">
            {VIEW_YEAR}년 {VIEW_MONTH}월
          </h1>
          <button
            type="button"
            aria-label="이전 달"
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>

        <div className="flex items-center gap-[18px]">
          {/* 오늘 버튼 */}
          <button
            type="button"
            className="flex h-[38px] w-[72px] items-center justify-center rounded-full border border-gray-300 bg-gray-00 text-[16px] font-semibold leading-[1.6] text-gray-1000 shadow-card transition-colors hover:bg-gray-300/50"
          >
            오늘
          </button>

          {/* 뷰 토글 */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="월간 보기"
              aria-pressed={view === "month"}
              onClick={() => setView("month")}
              className={
                view === "month" ? "text-gray-700" : "text-gray-400"
              }
            >
              <LayoutMonthIcon size={24} />
            </button>
            <button
              type="button"
              aria-label="주간 보기"
              aria-pressed={view === "week"}
              onClick={() => setView("week")}
              className={
                view === "week" ? "text-gray-700" : "text-gray-400"
              }
            >
              <LayoutWeekIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 일정 생성하기 */}
      <button
        type="button"
        className="flex h-[57px] w-[183px] items-center justify-center gap-[10px] rounded-full bg-carrot-600 text-[18px] font-semibold text-gray-00 transition-colors hover:brightness-95"
      >
        <PlusIcon size={18} />
        일정 생성하기
      </button>
    </div>
  );
}
