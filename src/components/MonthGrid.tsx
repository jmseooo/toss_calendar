"use client";

import { useState } from "react";
import {
  buildMonthGrid,
  TODAY,
  WEEKDAYS,
  type DayCell,
} from "@/lib/calendar";
import { eventsByDate } from "@/data/events";
import EventChip from "./EventChip";
import { useDayView } from "./DayViewContext";
import { useMonthView } from "./MonthViewContext";

const MAX_VISIBLE = 2; // 칸에 최대로 보여줄 칩 개수

/** 월간 캘린더 카드 (요일 헤더 + 6주 그리드) */
export default function MonthGrid() {
  const { year, month } = useMonthView();
  const cells = buildMonthGrid(year, month, TODAY);

  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] bg-gray-00 shadow-card">
      {/* 요일 헤더 — Figma: 라벨 y=15(h22) 뒤 11px 여백 → 그리드는 48px 지점부터 시작 */}
      <div className="grid grid-cols-7 px-[8px] pt-[15px] pb-[11px] sm:px-[14px]">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="px-[10px] text-[13px] font-semibold leading-[1.6] text-gray-600"
          >
            {w}
          </div>
        ))}
      </div>

      {/* 6주 그리드 — Figma: 6행 × 각 128px 고정. minmax로 최소 128px 보장해 아래가 잘리지 않게 */}
      <div className="grid grid-cols-7 grid-rows-[repeat(6,minmax(128px,1fr))]">
        {cells.map((cell) => (
          <DayCellView key={cell.date} cell={cell} />
        ))}
      </div>
    </div>
  );
}

function DayCellView({ cell }: { cell: DayCell }) {
  const { selectedDate, openDay } = useDayView();
  const isSelected = selectedDate === cell.date;
  const [hovered, setHovered] = useState(false);
  const dayEvents = eventsByDate(cell.date);
  const visible = dayEvents.slice(0, MAX_VISIBLE);
  const overflow = dayEvents.length - visible.length;

  // 선택 > 호버 우선순위. 마우스 이동 이벤트로 커서를 올리는 즉시 반응한다.
  // (CSS hover:는 터치 겸용 기기에서 @media(hover)에 걸려 탭해야 반응하는 문제가 있음)
  const bg = isSelected
    ? "bg-carrot-200/60"
    : hovered
      ? "bg-gray-300/40"
      : "";

  return (
    <button
      type="button"
      onClick={() => openDay(cell.date)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${cell.date} 일별 보기`}
      aria-pressed={isSelected}
      className={`flex min-w-0 flex-col gap-[6px] border-t border-l border-gray-300 px-[6px] py-[10px] text-left transition-colors first:border-l-0 sm:px-[10px] [&:nth-child(7n+1)]:border-l-0 ${bg}`}
    >
      {/* 날짜 숫자 (오늘이면 오렌지 원형) */}
      <div className="flex h-[24px] items-center">
        {cell.isToday ? (
          <span className="flex size-[24px] items-center justify-center rounded-full bg-carrot-600 text-[13px] font-semibold leading-[1.6] text-gray-00">
            {cell.day}
          </span>
        ) : (
          <span
            className={`px-[3px] text-[13px] font-semibold leading-[1.6] ${
              cell.inMonth ? "text-gray-800" : "text-gray-600"
            }`}
          >
            {cell.day}
          </span>
        )}
      </div>

      {/* 일정 칩 */}
      <div className="flex min-w-0 flex-col gap-[4px]">
        {visible.map((ev) => (
          <EventChip key={ev.id} event={ev} />
        ))}
        {overflow > 0 && (
          <span className="whitespace-nowrap px-[3px] text-[13px] font-semibold leading-[1.3] text-gray-700">
            +{overflow}개
          </span>
        )}
      </div>
    </button>
  );
}
