"use client";

import { useEffect, useState } from "react";
import { ExchangeIcon, LocationIcon } from "./icons";
import { useDayView } from "./DayViewContext";
import { useInvite } from "./InviteContext";
import {
  eventsByDate,
  type CalendarEvent,
  type EventColor,
} from "@/data/events";
import { addDays, formatAgendaHeading } from "@/lib/calendar";
import { useToday } from "./TodayContext";
import { useNotifPanel } from "./NotifPanelContext";
import Avatar from "./Avatar";
import { avatarByIndex } from "@/data/avatars";

/** 아젠다에 보여줄 날짜 수 (선택한 날짜 1 + 다음 2일) */
const AGENDA_DAY_COUNT = 3;

/** 촤라락 stagger 타이밍(ms) — 날짜 블록 간격, 카드 시작 오프셋, 카드 간격 */
const DAY_STEP = 90;
const CARD_OFFSET = 50;
const CARD_STEP = 45;

/** 아젠다 카드 좌측 바 색상 (연한 -bar 토큰) — 시간 일정용 */
const BAR: Record<EventColor, string> = {
  blue: "bg-ev-blue-bar",
  pink: "bg-ev-pink-bar",
  purple: "bg-ev-purple-bar",
  red: "bg-ev-red-bar",
  teal: "bg-ev-teal-bar",
};

/** 종일(블록) 일정용 채운 배경 + 텍스트 색 — 월간 뷰의 filled 칩과 동일 */
const FILLED: Record<EventColor, string> = {
  blue: "bg-ev-blue-fill text-ev-blue",
  pink: "bg-ev-pink-fill text-ev-pink",
  purple: "bg-ev-purple-fill text-ev-purple",
  red: "bg-ev-red-fill text-ev-red",
  teal: "bg-ev-teal-fill text-ev-teal",
};

/**
 * 우측 아젠다(일별 캘린더) 패널.
 * 월간 그리드에서 날짜를 클릭하면 그 날짜가 맨 위에 뜨고,
 * 그 아래로 기본 날짜(오늘·내일)가 이어집니다.
 *
 * 정렬 규칙(피그마 기준):
 * - 날짜 헤딩은 흰 카드 안쪽 맨 위에 들어간다.
 * - 첫 카드의 윗변이 월간 캘린더 카드의 윗변과 같은 라인에서 시작한다.
 *   (좌측 툴바 높이 57px + 툴바~캘린더 간격 19px = 76px)
 */
export default function AgendaPanel() {
  const { selectedDate } = useDayView();
  const { role, toggleRole, meetings } = useInvite();
  const { setOpen: setNotifOpen } = useNotifPanel();
  const today = useToday();

  // 역할 전환 버튼 밑에 3초간 뜨는 안내 말풍선.
  const [showRoleTip, setShowRoleTip] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setShowRoleTip(false), 3000);
    return () => window.clearTimeout(t);
  }, []);

  // 전환 버튼이 통통 튀며 "반대편 화면으로 넘어가 보라"고 유도하는 시점:
  //  - 주최자: 참여자 답변을 기다리는 회의가 있으면 → 참여자 화면으로
  //  - 참여자: 답변했지만 아직 확정 안 된 회의가 있으면 → 주최자 화면으로 (확정하러)
  const nudge = meetings.some((m) =>
    role === "organizer"
      ? m.reply === null
      : m.reply !== null && m.confirmedTime === null,
  );

  // 기준 날짜: 월간 그리드에서 고른 날짜, 없으면 오늘.
  // 이 날짜를 맨 위에 두고 그 아래로 "다음 날짜"들을 하루씩 이어 붙인다.
  const baseDate = selectedDate ?? today;
  const dates = Array.from({ length: AGENDA_DAY_COUNT }, (_, i) =>
    addDays(baseDate, i),
  );

  return (
    <div className="flex w-full flex-col lg:w-[300px] xl:w-[321px]">
      {/* 상단 버튼 줄 — 높이 57px은 툴바(min-h-[57px])와 같다. 덕분에 "초대자 화면"
          버튼이 툴바의 "일정 생성하기" 버튼과 세로 중심으로 나란히 놓인다.
          아래 mt-[19px]는 main 의 gap-[19px]와 같은 값. (원래 pt-[76px] = 57 + 19) */}
      <div className="relative flex min-h-[57px] items-center">
        {/* 역할 전환 버튼 밑 안내 말풍선 — 3초 뒤 사라진다 */}
        {showRoleTip && (
          <div className="pointer-events-none absolute left-0 top-full z-20 mt-[6px] flex flex-col items-start">
            <div className="ml-[26px] size-0 border-x-[6px] border-b-[7px] border-x-transparent border-b-gray-1000" />
            <div className="whitespace-nowrap rounded-[12px] bg-gray-1000 px-[10px] py-[10px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-100 shadow-card">
              화면을 전환해보세요
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            // 역할을 바꾸면 그쪽 알림을 먼저 보여준다 (알림 패널 열기 → 아젠다 접힘).
            toggleRole();
            setNotifOpen(true);
          }}
          className={`flex h-[42px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full bg-gray-00 px-[14px] text-[15px] font-semibold leading-[1.6] tracking-[-0.5px] text-black transition duration-150 ease-out hover:scale-[1.04] hover:bg-gray-300/50 active:scale-[0.98] ${
            nudge ? "animate-nudge-pulse" : ""
          }`}
        >
          <ExchangeIcon size={20} />
          <span className="animate-text-shimmer">
            {role === "organizer" ? "초대자 화면" : "주최자 화면"}
          </span>
        </button>
      </div>

      {/* key={baseDate} — 날짜를 새로 고를 때마다 아래 전체가 다시 마운트되어
          촤라락 애니메이션이 매번 처음부터 재생된다. */}
      <div key={baseDate} className="mt-[19px] flex flex-col gap-[22px]">
        {dates.map((date, i) => (
          <DayCard
            key={date}
            date={date}
            active={date === selectedDate}
            delay={i * DAY_STEP}
          />
        ))}
      </div>
    </div>
  );
}

/** 날짜 헤딩 (선택된 날짜면 오렌지). pl은 아래 일정 카드의 색상 바와 좌측을 맞춘다. */
function DayHeading({
  date,
  active,
  delay,
}: {
  date: string;
  active: boolean;
  delay: number;
}) {
  return (
    <h2
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-agenda-cascade pl-[6px] text-[18px] font-semibold leading-[1.6] ${
        active ? "text-carrot-600" : "text-black"
      }`}
    >
      {formatAgendaHeading(date)}
    </h2>
  );
}

/** 하루치 일정 카드(흰 카드 = 날짜 헤딩 + 일정 목록). delay = 그 날짜 블록이 나타나기 시작하는 시각 */
function DayCard({
  date,
  active,
  delay,
}: {
  date: string;
  active: boolean;
  delay: number;
}) {
  // 종일(블록) 일정을 맨 위로, 나머지(시간 일정)는 원래 순서 유지.
  const { role, confirmedEvents } = useInvite();
  const dayEvents = [
    ...eventsByDate(date, role),
    ...confirmedEvents.filter((e) => e.date === date),
  ].sort((a, b) => (a.chip === "filled" ? 0 : 1) - (b.chip === "filled" ? 0 : 1));

  // 안쪽 일정은 흰 카드가 뜬 직후부터 한 장씩 젖혀진다.
  const cardDelay = delay + CARD_OFFSET;

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-agenda-fade flex flex-col gap-[8px] rounded-[18px] bg-gray-00 px-[22px] py-[24px] shadow-card"
    >
      <DayHeading date={date} active={active} delay={delay} />

      {dayEvents.length > 0 ? (
        dayEvents.map((event, i) => (
          <AgendaCard
            key={event.id}
            event={event}
            delay={cardDelay + i * CARD_STEP}
          />
        ))
      ) : (
        <p
          style={{ animationDelay: `${cardDelay}ms` }}
          className="animate-agenda-cascade px-[14px] py-[18px] text-[14px] font-medium leading-[1.3] text-gray-600"
        >
          일정이 없습니다.
        </p>
      )}
    </div>
  );
}

function AgendaCard({ event, delay }: { event: CalendarEvent; delay: number }) {
  // 월간 뷰의 블록(filled) = 종일 일정. 아젠다에서도 채운 블록으로 표시한다.
  const isAllDay = event.chip === "filled";
  // 호버 시에만 옅은 회색 배경. 터치 겸용 기기에서도 커서에 바로 반응하도록
  // CSS hover: 대신 마우스 이벤트로 직접 제어한다.
  const [hovered, setHovered] = useState(false);

  // 종일 카드는 이미 채운 블록이라 회색 호버를 덧입히지 않는다.
  const bg = isAllDay
    ? FILLED[event.color]
    : hovered
      ? "bg-gray-300/60"
      : "";

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-agenda-cascade flex items-stretch gap-[12px] rounded-[18px] py-[12px] pr-[14px] transition-colors ${
        // 선(바) 일정은 왼쪽으로 조금 밀어 종일 일정과 시선을 맞춘다
        isAllDay ? "pl-[14px]" : "pl-[6px]"
      } ${bg}`}
    >
      {/* 좌측 색상 바 — 시간 일정만. 종일은 블록 전체가 색이라 바가 없다. */}
      {!isAllDay && (
        <span
          className={`h-[18px] w-[4px] shrink-0 self-start rounded-[6px] ${BAR[event.color]}`}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        {/* 시간(또는 종일) · 제목 */}
        <div
          className={`flex flex-col gap-[3px] font-semibold leading-[1.3] ${
            isAllDay ? "" : "text-gray-1000"
          }`}
        >
          {isAllDay ? (
            <p className="text-[14px]">종일</p>
          ) : (
            event.startTime && (
              <p className="text-[14px]">
                {event.startTime}~{event.endTime}
              </p>
            )
          )}
          <p className="text-[16px]">{event.title}</p>
        </div>

        {/* 장소 */}
        {event.location && (
          <div className="flex items-center gap-px text-gray-700">
            <LocationIcon size={20} className="text-gray-700" />
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
          <div className="flex items-center gap-[3px]">
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <Avatar
                  key={i}
                  src={avatarByIndex(event.title.length * 3 + i)}
                  className="size-[28px] border-2 border-gray-00"
                  style={{ marginLeft: i === 0 ? 0 : -14 }} // 지름의 절반만큼 겹친다
                />
              ))}
            </div>
            <span className="text-[14px] font-semibold leading-[1.3] text-gray-600">
              +{event.attendeeCount}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
