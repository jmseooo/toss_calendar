"use client";

import {
  buildWeekGrid,
  TODAY,
  WEEKDAYS,
  type DayCell,
} from "@/lib/calendar";
import {
  eventsByDate,
  type CalendarEvent,
  type EventColor,
} from "@/data/events";
import EventChip from "./EventChip";
import { LocationIcon } from "./icons";
import { useDayView } from "./DayViewContext";
import { useWeekView } from "./WeekViewContext";

/** 시간 일정 카드: 옅은 채움 배경 */
const CARD_FILL: Record<EventColor, string> = {
  blue: "bg-ev-blue-fill",
  pink: "bg-ev-pink-fill",
  purple: "bg-ev-purple-fill",
  red: "bg-ev-red-fill",
  teal: "bg-ev-teal-fill",
};

/** 시간 일정 카드: 제목 텍스트 색 */
const CARD_TEXT: Record<EventColor, string> = {
  blue: "text-ev-blue",
  pink: "text-ev-pink",
  purple: "text-ev-purple",
  red: "text-ev-red",
  teal: "text-ev-teal",
};

/**
 * 주간 캘린더 카드 — Figma 시안(node 243:7903) 기준.
 * 요일 헤더 · 날짜/종일 밴드 · 구분선 · 요일별 시간 일정 컬럼으로 구성됩니다.
 * 툴바에서 이동한 주(anchor)가 속한 일~토를 보여주며,
 * 월간·일별과 동일한 events 소스(eventsByDate)를 그대로 읽습니다.
 */
export default function WeekGrid() {
  const { anchor } = useWeekView();
  const cells = buildWeekGrid(anchor, TODAY);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] bg-gray-00 shadow-card">
      {/* 요일 헤더 */}
      <div className="flex px-[8px] pt-[15px] sm:px-[14px]">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="flex-1 px-[10px] text-[13px] font-semibold leading-[1.6] text-gray-600"
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 + 종일(블록) 일정 밴드 — 고정 높이로 아래 구분선을 나란히 맞춘다 */}
      <div className="flex px-[8px] sm:px-[14px]">
        {cells.map((cell) => (
          <WeekHeaderCell key={cell.date} cell={cell} />
        ))}
      </div>

      {/* 종일 영역과 시간 일정 영역을 가르는 구분선 */}
      <div className="border-t border-gray-400" />

      {/* 요일별 시간 일정 컬럼 */}
      <div className="flex flex-1 px-[8px] pt-[10px] sm:px-[14px]">
        {cells.map((cell) => (
          <WeekTimedColumn key={cell.date} cell={cell} />
        ))}
      </div>
    </div>
  );
}

/** 날짜 숫자 + 종일(filled) 일정 칩 — 밴드 한 칸 */
function WeekHeaderCell({ cell }: { cell: DayCell }) {
  const { openDay } = useDayView();
  const allDay = eventsByDate(cell.date).filter((e) => e.chip === "filled");

  return (
    <div className="flex min-h-[80px] min-w-0 flex-1 flex-col gap-[8px] px-[6px] pb-[10px] pt-[9px]">
      {/* 날짜 숫자 (오늘이면 오렌지 원형) — 클릭 시 우측 아젠다를 그 날짜로 연다 */}
      <button
        type="button"
        onClick={() => openDay(cell.date)}
        aria-label={`${cell.date} 일별 보기`}
        className="flex h-[22px] items-center self-start"
      >
        {cell.isToday ? (
          <span className="flex size-[22px] items-center justify-center rounded-full bg-carrot-600 text-[13px] font-semibold leading-[1.6] text-gray-00">
            {cell.day}
          </span>
        ) : (
          <span className="px-[3px] text-[13px] font-semibold leading-[1.6] text-gray-800">
            {cell.day}
          </span>
        )}
      </button>

      {/* 종일 일정 칩 (월간 뷰와 동일한 filled 스타일) */}
      <div className="flex min-w-0 flex-col gap-[4px]">
        {allDay.map((ev) => (
          <EventChip key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}

/** 하루치 시간 일정 카드 스택 — 컬럼 한 칸 */
function WeekTimedColumn({ cell }: { cell: DayCell }) {
  const timed = eventsByDate(cell.date).filter((e) => e.chip !== "filled");

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[8px] px-[6px]">
      {timed.map((ev) => (
        <WeekEventCard key={ev.id} event={ev} />
      ))}
    </div>
  );
}

/** 시간 일정 카드 — 시간 · 제목 · 장소 */
function WeekEventCard({ event }: { event: CalendarEvent }) {
  const { openDay } = useDayView();

  return (
    <button
      type="button"
      onClick={() => openDay(event.date)}
      className={`flex flex-col items-start gap-[8px] rounded-[6px] px-[10px] py-[8px] text-left transition-[filter] hover:brightness-95 ${CARD_FILL[event.color]}`}
    >
      <div className="flex min-w-0 flex-col gap-[2px]">
        {event.startTime && (
          <p className="text-[13px] font-semibold leading-[1.3] text-gray-1000">
            {event.startTime}~{event.endTime}
          </p>
        )}
        <p
          className={`truncate text-[15px] font-semibold leading-[1.3] ${CARD_TEXT[event.color]}`}
        >
          {event.title}
        </p>
      </div>

      {event.location && (
        <div className="flex items-center gap-px text-gray-800">
          <LocationIcon size={13} />
          <span className="text-[13px] font-semibold leading-[1.3]">
            {event.location}
          </span>
        </div>
      )}
    </button>
  );
}
