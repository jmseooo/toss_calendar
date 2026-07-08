"use client";

import MonthGrid from "./MonthGrid";
import WeekGrid from "./WeekGrid";
import { useViewMode } from "./ViewModeContext";

/**
 * 뷰 모드(월/주)에 따라 월간·주간 캘린더를 전환해 보여준다.
 * key={mode} 로 모드가 바뀔 때마다 래퍼가 다시 마운트되어
 * 전환 애니메이션(view-enter)이 매번 재생된다.
 */
export default function CalendarView() {
  const { mode } = useViewMode();
  return (
    <div
      key={mode}
      className="animate-view-enter flex min-h-0 flex-1 flex-col"
    >
      {mode === "week" ? <WeekGrid /> : <MonthGrid />}
    </div>
  );
}
