import { LocationIcon } from "./icons";
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

/** 우측 아젠다 패널 — 선택된 날짜들의 일정 목록 */
export default function AgendaPanel() {
  return (
    <div className="grid w-full grid-cols-1 gap-[30px] sm:grid-cols-2 xl:w-[321px] xl:grid-cols-1">
      {AGENDA_DATES.map((date) => (
        <section key={date} className="flex flex-col gap-[10px]">
          <h2 className="px-[24px] text-[24px] font-semibold leading-[1.6] text-gray-1000">
            {formatAgendaHeading(date)}
          </h2>
          <div className="flex flex-col gap-[12px] rounded-[30px] bg-gray-00 px-[19px] py-[21px] shadow-card">
            {eventsByDate(date)
              .filter((e) => e.startTime)
              .map((event) => (
                <AgendaCard key={event.id} event={event} />
              ))}
          </div>
        </section>
      ))}
    </div>
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
          <p className="text-[16px]">
            {event.startTime}~{event.endTime}
          </p>
          <p className="text-[18px]">{event.title}</p>
        </div>

        {/* 장소 */}
        {event.location && (
          <div className="flex items-center gap-px text-gray-700">
            <LocationIcon size={20} />
            <span className="text-[16px] font-semibold leading-[1.3]">
              {event.location}
            </span>
          </div>
        )}

        {/* 회의 링크 */}
        {event.link && (
          <a
            href={event.link}
            className="truncate text-[13px] font-medium leading-[1.3] text-ev-blue hover:underline"
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
            <span className="text-[16px] font-semibold leading-[1.3] text-black">
              +{event.attendeeCount}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
