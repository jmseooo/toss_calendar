"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutMonthIcon,
  LayoutWeekIcon,
  PlusIcon,
} from "./icons";
import { useMonthView } from "./MonthViewContext";
import { useWeekView } from "./WeekViewContext";
import { useViewMode } from "./ViewModeContext";
import { yearMonthOf } from "@/lib/calendar";

/**
 * 캘린더 상단 툴바.
 * 제목 · 이전/다음 · 오늘 · 뷰 토글 · "일정 생성하기".
 * 이전/다음 화살표와 "오늘" 버튼은 현재 모드(월간/주간)에 맞춰
 * 표시 중인 월 또는 주를 실제로 바꾼다.
 */
export default function CalendarToolbar() {
  const { mode, setMode } = useViewMode();
  const monthView = useMonthView();
  const weekView = useWeekView();

  // 주간 모드에서는 기준 주(anchor)가 속한 연·월을 제목으로 쓰고,
  // 이동/오늘 동작도 주 단위로 전환한다. (그 외엔 월간 동작)
  const isWeek = mode === "week";
  const { year, month } = isWeek
    ? yearMonthOf(weekView.anchor)
    : { year: monthView.year, month: monthView.month };
  const goPrev = isWeek ? weekView.goPrev : monthView.goPrev;
  const goNext = isWeek ? weekView.goNext : monthView.goNext;
  const goToday = isWeek ? weekView.goToday : monthView.goToday;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-y-[12px]">
      <div className="flex flex-wrap items-center gap-[18px] gap-y-[10px]">
        {/* 월 제목 + 이동 화살표 */}
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[24px] font-semibold leading-[1.6] text-gray-1000">
            {year}년 {month}월
          </h1>
          <button
            type="button"
            aria-label={isWeek ? "이전 주" : "이전 달"}
            onClick={goPrev}
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <button
            type="button"
            aria-label={isWeek ? "다음 주" : "다음 달"}
            onClick={goNext}
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>

        <div className="flex items-center gap-[18px]">
          {/* 오늘 버튼 */}
          <button
            type="button"
            onClick={goToday}
            className="flex h-[38px] w-[72px] items-center justify-center rounded-full border border-gray-300 bg-gray-00 text-[16px] font-semibold leading-[1.6] text-gray-1000 shadow-card transition-colors hover:bg-gray-300/50"
          >
            오늘
          </button>

          {/* 뷰 토글 */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="월간 보기"
              aria-pressed={mode === "month"}
              onClick={() => setMode("month")}
              className={
                mode === "month" ? "text-gray-700" : "text-gray-400"
              }
            >
              <LayoutMonthIcon size={24} />
            </button>
            <button
              type="button"
              aria-label="주간 보기"
              aria-pressed={mode === "week"}
              onClick={() => setMode("week")}
              className={
                mode === "week" ? "text-gray-700" : "text-gray-400"
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
        className="flex h-[42px] w-[144px] items-center justify-center gap-[8px] rounded-full bg-carrot-600 text-[16px] font-semibold text-gray-00 transition-colors hover:brightness-95"
      >
        <PlusIcon size={16} />
        일정 생성하기
      </button>
    </div>
  );
}
