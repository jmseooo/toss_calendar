"use client";

import { LocationIcon } from "./icons";
import { useDayView } from "./DayViewContext";
import {
  AGENDA_DATES,
  eventsByDate,
  type CalendarEvent,
  type EventColor,
} from "@/data/events";
import { formatAgendaHeading } from "@/lib/calendar";

/** 아젠다 카드 좌측 바 색상 (연한 -bar 토큰) */
const BAR: Record<EventColor, string> = {
  blue: "bg-ev-blue-bar",
  pink: "bg-ev-pink-bar",
  purple: "bg-ev-purple-bar",
  red: "bg-ev-red-bar",
  teal: "bg-ev-teal-bar",
};

/**
 * 우측 아젠다(일별 캘린더) 패널.
 * 월간 그리드에서 날짜를 클릭하면 그 날짜가 맨 위에 뜨고,
 * 그 아래로 기본 날짜(오늘·내일)가 이어집니다.
 *
 * 정렬 규칙(피그마 기준):
 * - 첫 날짜 헤딩은 좌측 툴바와 같은 높이 대역(57px)에 놓여,
 * - 첫 일정 카드의 윗변이 월간 캘린더 카드의 윗변과 같은 라인에서 시작한다.
 */
export default function AgendaPanel() {
  const { selectedDate } = useDayView();

  // 선택된 날짜를 맨 앞에 두고, 기본 날짜에서 중복은 제거
  const dates = selectedDate
    ? [selectedDate, ...AGENDA_DATES.filter((d) => d !== selectedDate)]
    : [...AGENDA_DATES];

  const [firstDate, ...restDates] = dates;

  return (
    <div className="flex w-[200px] flex-col gap-[19px] sm:w-[260px] md:w-[300px] xl:w-[321px]">
      {/* 첫 날짜 헤딩 — 툴바와 같은 57px 높이로 맞춰 아래 카드가 월간 그리드와 정렬 */}
      <div className="flex h-[57px] items-center">
        <DayHeading date={firstDate} active={firstDate === selectedDate} />
      </div>

      {/* 카드 스택 — 첫 카드는 헤딩 없이 바로, 이후 날짜는 헤딩 + 카드 */}
      <div className="flex flex-col gap-[30px]">
        <DayCardBody date={firstDate} />
        {restDates.map((date) => (
          <DaySection
            key={date}
            date={date}
            active={date === selectedDate}
          />
        ))}
      </div>
    </div>
  );
}

/** 날짜 헤딩 (선택된 날짜면 오렌지) */
function DayHeading({ date, active }: { date: string; active: boolean }) {
  return (
    <h2
      className={`px-[24px] text-[22px] font-semibold leading-[1.6] ${
        active ? "text-carrot-600" : "text-gray-1000"
      }`}
    >
      {formatAgendaHeading(date)}
    </h2>
  );
}

/** 하루치 일정 카드(흰 카드 + 일정 목록) */
function DayCardBody({ date }: { date: string }) {
  const dayEvents = eventsByDate(date);

  return (
    <div className="flex flex-col gap-[12px] rounded-[30px] bg-gray-00 px-[19px] py-[21px] shadow-card">
      {dayEvents.length > 0 ? (
        dayEvents.map((event) => <AgendaCard key={event.id} event={event} />)
      ) : (
        <p className="px-[14px] py-[18px] text-[14px] font-medium leading-[1.3] text-gray-600">
          일정이 없습니다.
        </p>
      )}
    </div>
  );
}

/** 하루치 섹션 — 날짜 헤딩 + 일정 카드 (첫 날짜 이후에 사용) */
function DaySection({ date, active }: { date: string; active: boolean }) {
  return (
    <section className="flex flex-col gap-[10px]">
      <DayHeading date={date} active={active} />
      <DayCardBody date={date} />
    </section>
  );
}

function AgendaCard({ event }: { event: CalendarEvent }) {
  return (
    <article className="flex items-stretch gap-[12px] rounded-[22px] px-[14px] py-[18px]">
      {/* 좌측 색상 바 */}
      <span className={`w-[4px] shrink-0 rounded-[6px] ${BAR[event.color]}`} />

      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        {/* 시간 · 제목 */}
        <div className="flex flex-col gap-[3px] font-semibold leading-[1.3] text-gray-1000">
          {event.startTime && (
            <p className="text-[14px]">
              {event.startTime}~{event.endTime}
            </p>
          )}
          <p className="text-[16px]">{event.title}</p>
        </div>

        {/* 장소 */}
        {event.location && (
          <div className="flex items-center gap-px text-gray-700">
            <LocationIcon size={20} />
            <span className="text-[14px] font-semibold leading-[1.3]">
              {event.location}
            </span>
          </div>
        )}

        {/* 회의 링크 */}
        {event.link && (
          <a
            href={event.link}
            className="truncate text-[11px] font-medium leading-[1.3] text-ev-blue hover:underline"
          >
            {event.link}
          </a>
        )}

        {/* 참석자 아바타 */}
        {event.attendeeCount ? (
          <div className="flex items-center gap-[10px]">
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-[36px] rounded-full border-2 border-gray-00 bg-gray-600"
                  style={{ marginLeft: i === 0 ? 0 : -18 }}
                />
              ))}
            </div>
            <span className="text-[14px] font-semibold leading-[1.3] text-black">
              +{event.attendeeCount}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
