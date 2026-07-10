"use client";

import { useEffect, useRef, useState } from "react";
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

/** 달을 넘기는 데 필요한 휠 누적량. 마우스 휠 한 칸(deltaY 100)이면 바로 넘어간다. */
const WHEEL_THRESHOLD = 100;
/** 달을 넘긴 뒤 이만큼은 휠을 무시한다. 트랙패드 관성으로 몇 달씩 건너뛰는 걸 막는다. */
const WHEEL_COOLDOWN_MS = 400;

/** 세로로 스크롤할 여지가 남은 가장 가까운 조상. 없으면 null */
function scrollableParent(node: HTMLElement): HTMLElement | null {
  for (let el = node.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    const scrollable = overflowY === "auto" || overflowY === "scroll";
    if (scrollable && el.scrollHeight > el.clientHeight) return el;
  }
  return null;
}

/** 월간 캘린더 카드 (요일 헤더 + 6주 그리드) */
export default function MonthGrid() {
  const { year, month, goPrev, goNext } = useMonthView();
  const cells = buildMonthGrid(year, month, TODAY);
  const rootRef = useRef<HTMLDivElement>(null);

  // 휠(트랙패드 포함)로 달 이동. 그리드가 화면보다 길면 세로 스크롤이 우선이고,
  // 위/아래 끝에 닿은 뒤 한 번 더 굴려야 달이 넘어간다.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let accumulated = 0;
    let cooldown = false;
    let timer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // 가로 스와이프는 무시

      // 아직 스크롤할 여지가 있으면 브라우저에 맡긴다.
      const scroller = scrollableParent(root);
      if (scroller) {
        const atTop = scroller.scrollTop <= 0;
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          accumulated = 0;
          return;
        }
      }

      e.preventDefault(); // 끝에 닿았으니 스크롤 대신 달 이동으로 쓴다
      if (cooldown) {
        accumulated = 0; // 관성으로 밀려드는 이벤트가 다음 이동에 쌓이지 않게
        return;
      }

      accumulated += e.deltaY;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      if (accumulated > 0) goNext();
      else goPrev();

      accumulated = 0;
      cooldown = true;
      timer = setTimeout(() => {
        cooldown = false;
      }, WHEEL_COOLDOWN_MS);
    };

    // React의 onWheel은 passive라 preventDefault가 먹지 않는다. 직접 등록한다.
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      clearTimeout(timer);
    };
  }, [goPrev, goNext]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col overflow-hidden rounded-[18px] bg-gray-00 shadow-card"
    >
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
