"use client";

import { useEffect, useRef, useState } from "react";
import { buildWeekGrid, WEEKDAYS, type DayCell } from "@/lib/calendar";
import { useWheelPaging } from "@/lib/useWheelPaging";
import {
  eventsByDate,
  type CalendarEvent,
  type EventColor,
} from "@/data/events";
import { LocationIcon } from "./icons";
import { useDayView } from "./DayViewContext";
import { useWeekView } from "./WeekViewContext";
import { useInvite } from "./InviteContext";
import { useToday } from "./TodayContext";

/** 좌측 색상 바 (line 방식) — 일별 뷰와 같은 -bar 토큰 */
const BAR: Record<EventColor, string> = {
  blue: "bg-ev-blue-bar",
  pink: "bg-ev-pink-bar",
  purple: "bg-ev-purple-bar",
  red: "bg-ev-red-bar",
  teal: "bg-ev-teal-bar",
};

/** 제목 텍스트 색 */
const CARD_TEXT: Record<EventColor, string> = {
  blue: "text-ev-blue",
  pink: "text-ev-pink",
  purple: "text-ev-purple",
  red: "text-ev-red",
  teal: "text-ev-teal",
};

/** 확정 강조용 진한 색 (오버레이) */
const CARD_STRONG: Record<EventColor, string> = {
  blue: "bg-ev-blue",
  pink: "bg-ev-pink",
  purple: "bg-ev-purple",
  red: "bg-ev-red",
  teal: "bg-ev-teal",
};

/**
 * 주간 캘린더 카드 — Figma 시안(node 243:7903) 기준.
 * 요일 헤더 · 날짜/종일 밴드 · 구분선 · 요일별 시간 일정 컬럼으로 구성됩니다.
 * 툴바에서 이동한 주(anchor)가 속한 일~토를 보여주며,
 * 월간·일별과 동일한 events 소스(eventsByDate)를 그대로 읽습니다.
 */
export default function WeekGrid() {
  const { anchor, goPrev, goNext } = useWeekView();
  const cells = buildWeekGrid(anchor, useToday());
  const rootRef = useRef<HTMLDivElement>(null);

  useWheelPaging(rootRef, goPrev, goNext); // 휠로 이전/다음 주

  return (
    <div
      ref={rootRef}
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] bg-gray-00 shadow-card"
    >
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

      {/* 날짜 줄 (종일 밴드 없음 — 종일 일정은 line 방식으로 아래 컬럼에 함께 표시) */}
      <div className="flex px-[8px] sm:px-[14px]">
        {cells.map((cell) => (
          <WeekHeaderCell key={cell.date} cell={cell} />
        ))}
      </div>

      {/* 날짜 줄과 일정 영역을 가르는 구분선 */}
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

/** 날짜 숫자 — 밴드 한 칸 (종일 칩 없음) */
function WeekHeaderCell({ cell }: { cell: DayCell }) {
  const { openDay } = useDayView();

  return (
    <div className="flex min-w-0 flex-1 px-[6px] pb-[10px] pt-[9px]">
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
    </div>
  );
}

/** 하루치 시간 일정 카드 스택 — 컬럼 한 칸 */
function WeekTimedColumn({ cell }: { cell: DayCell }) {
  const { role, confirmedEvents, lastConfirmedId, optionalMeeting } =
    useInvite();
  // 시드 일정 + 이 날 확정된 회의를 합친다. 확정 회의는 chip: "line" 이라 시간 컬럼에 온다.
  const confirmed = confirmedEvents.filter((e) => e.date === cell.date);
  // 선택 참여자 초대를 탭했을 때 이 날에 임시로 생기는 가(假) 일정 (참여자 뷰 전용).
  const tentative =
    role === "invitee" &&
    optionalMeeting &&
    optionalMeeting.date === cell.date
      ? [optionalMeeting]
      : [];
  const timed = [
    ...eventsByDate(cell.date, role),
    ...confirmed,
    ...tentative,
  ].filter((e) => e.chip !== "filled");

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[8px] px-[6px]">
      {timed.map((ev) => (
        <WeekEventCard
          key={ev.id}
          event={ev}
          // 방금 확정한 블록만 펼쳐지며 나타난다
          justAdded={ev.id === lastConfirmedId}
        />
      ))}
    </div>
  );
}

/** 시간 일정 — line 방식(좌측 색상 바 + 시간·제목·장소) */
function WeekEventCard({
  event,
  justAdded = false,
}: {
  event: CalendarEvent;
  justAdded?: boolean;
}) {
  const { openDay } = useDayView();

  // 임시 카드 덮개(cover) 제거용 — 애니메이션이 끝까지 못 가더라도, 재생 시간이
  // 지나면 덮개를 아예 없애 정적 점선 테두리(네 변 완성)가 확실히 남게 한다.
  const [coverGone, setCoverGone] = useState(false);
  useEffect(() => {
    if (!justAdded || !event.tentative) return;
    const t = window.setTimeout(() => setCoverGone(true), 760);
    return () => window.clearTimeout(t);
  }, [justAdded, event.tentative]);

  // 임시(가) 일정 — 주황 점선 카드 (Figma 243:9275). 탭하면 펼침 애니메이션과 함께 생기고,
  // 점선 테두리는 한 획이 둘레를 한 바퀴 그린 뒤 점선으로 남는다.
  if (event.tentative) {
    return (
      <button
        type="button"
        onClick={() => openDay(event.date)}
        // 카드 스케일 애니메이션은 넣지 않는다 — 커지는 동안 SVG 테두리가 함께
        // 늘어나 점선 그리기가 흔들리기 때문. 등장 효과는 점선 그리기로 대신한다.
        className="relative flex min-h-[200px] w-full min-w-0 flex-col gap-[6px] rounded-[6px] bg-gray-00 px-[10px] py-[12px] text-left transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* 점선 테두리 — 배경색 획으로 덮었다가 둘레를 한 바퀴 걷어내며 점선을 드러낸다.
            보이는 요소라 CSS 애니메이션이 끝까지(테두리 완성) 확실히 재생된다.
            (pathLength=1 정규화라 카드 크기와 무관) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <rect
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            rx="6"
            fill="none"
            stroke="#ff6600"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="4 4"
          />
          {/* 카드 배경색(#fff) 획 — 처음 생길 때 점선을 덮었다가 걷힌다.
              offset 0 → -1 로 걷어내면 좌상단(경로 시작점)에서 시계방향으로 한 바퀴
              돌아 다시 좌상단에서 끝난다. SMIL(linear)이라 일정 속도로 매끄럽게 완주하고,
              재생이 끝나면(coverGone) 덮개를 제거해 네 변을 남긴다. */}
          {justAdded && !coverGone && (
            <rect
              x="0.5"
              y="0.5"
              width="99"
              height="99"
              rx="6"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={0}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-1"
                dur="0.7s"
                calcMode="linear"
                fill="freeze"
              />
            </rect>
          )}
        </svg>
        <div className="flex min-w-0 flex-col gap-[2px]">
          {event.startTime && (
            <p className="text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#471601] [overflow-wrap:anywhere]">
              {event.startTime}~{event.endTime}
            </p>
          )}
          <p className="text-[15px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 [overflow-wrap:anywhere]">
            {event.title}
          </p>
        </div>
        {event.location && (
          <div className="flex min-w-0 items-start gap-px text-gray-800">
            <LocationIcon size={13} className="mt-[1px] shrink-0" />
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] [overflow-wrap:anywhere]">
              {event.location}
            </span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openDay(event.date)}
      className={`group relative flex w-full min-w-0 items-stretch gap-[8px] overflow-hidden rounded-[6px] py-[4px] pl-[3px] pr-[6px] text-left transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-300/40 ${
        justAdded ? "animate-block-unfold" : ""
      }`}
    >
      {/* 확정 강조 — 진한 색이 잠깐 덮였다가 사라지며 원래 색을 드러낸다 */}
      {justAdded && (
        <span
          className={`animate-confirm-glow pointer-events-none absolute inset-0 rounded-[6px] ${CARD_STRONG[event.color]}`}
        />
      )}

      {/* 좌측 색상 바 */}
      <span
        className={`w-[3px] shrink-0 self-stretch rounded-full ${BAR[event.color]}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        {event.startTime && (
          <p className="truncate text-[12px] font-semibold leading-[1.3] text-gray-800">
            {event.startTime}~{event.endTime}
          </p>
        )}
        <p
          className={`truncate text-[13px] font-semibold leading-[1.3] ${CARD_TEXT[event.color]}`}
        >
          {event.title}
        </p>
        {event.location && (
          <div className="flex min-w-0 items-center gap-px text-gray-700">
            <LocationIcon size={12} className="shrink-0" />
            <span className="truncate text-[11px] font-semibold leading-[1.3]">
              {event.location}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
