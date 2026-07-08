import type { CalendarEvent, EventColor } from "@/data/events";

/*
 * 색상별 Tailwind 클래스 매핑.
 * (Tailwind는 런타임 문자열 조합 클래스를 인식하지 못하므로 리터럴로 나열)
 */
const FILLED: Record<EventColor, string> = {
  blue: "bg-ev-blue-fill text-ev-blue",
  pink: "bg-ev-pink-fill text-ev-pink",
  purple: "bg-ev-purple-fill text-ev-purple",
  red: "bg-ev-red-fill text-ev-red",
  teal: "bg-ev-teal-fill text-ev-teal",
};

const LINE_TEXT: Record<EventColor, string> = {
  blue: "text-ev-blue",
  pink: "text-ev-pink",
  purple: "text-ev-purple",
  red: "text-ev-red",
  teal: "text-ev-teal",
};

const BAR_BG: Record<EventColor, string> = {
  blue: "bg-ev-blue",
  pink: "bg-ev-pink",
  purple: "bg-ev-purple",
  red: "bg-ev-red",
  teal: "bg-ev-teal",
};

/** 월간 칸에 들어가는 한 줄짜리 일정 칩 */
export default function EventChip({ event }: { event: CalendarEvent }) {
  if (event.chip === "filled") {
    return (
      <div
        className={`flex h-[28px] items-center truncate rounded-[6px] px-[10px] text-[13px] font-semibold leading-[1.3] ${FILLED[event.color]}`}
      >
        <span className="truncate">{event.title}</span>
      </div>
    );
  }

  // line 스타일: 좌측 색상 바 + 텍스트
  return (
    <div className="flex h-[21px] items-center gap-[6px]">
      <span
        className={`h-[16px] w-[3px] shrink-0 rounded-full ${BAR_BG[event.color]}`}
      />
      <span
        className={`truncate text-[13px] font-semibold leading-[1.3] ${LINE_TEXT[event.color]}`}
      >
        {event.title}
      </span>
    </div>
  );
}
