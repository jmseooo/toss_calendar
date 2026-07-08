import {
  buildMonthGrid,
  VIEW_YEAR,
  VIEW_MONTH,
  TODAY,
  WEEKDAYS,
  type DayCell,
} from "@/lib/calendar";
import { eventsByDate } from "@/data/events";
import EventChip from "./EventChip";

const MAX_VISIBLE = 2; // 칸에 최대로 보여줄 칩 개수

/** 월간 캘린더 카드 (요일 헤더 + 6주 그리드) */
export default function MonthGrid() {
  const cells = buildMonthGrid(VIEW_YEAR, VIEW_MONTH, TODAY);

  return (
    <div className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-[24px] bg-gray-00 shadow-card sm:rounded-[36px]">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 px-[8px] pt-[15px] sm:px-[14px]">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="px-[10px] text-[13px] font-semibold leading-[1.6] text-gray-600"
          >
            {w}
          </div>
        ))}
      </div>

      {/* 6주 그리드 */}
      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {cells.map((cell) => (
          <DayCellView key={cell.date} cell={cell} />
        ))}
      </div>
    </div>
  );
}

function DayCellView({ cell }: { cell: DayCell }) {
  const dayEvents = eventsByDate(cell.date);
  const visible = dayEvents.slice(0, MAX_VISIBLE);
  const overflow = dayEvents.length - visible.length;

  return (
    <div className="flex min-w-0 flex-col gap-[6px] border-t border-l border-gray-300 px-[6px] py-[10px] first:border-l-0 sm:px-[10px] [&:nth-child(7n+1)]:border-l-0">
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
    </div>
  );
}
