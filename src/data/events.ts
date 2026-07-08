/**
 * 일정(이벤트) 데이터.
 *
 * ⚠️ 현재는 Figma 시안 재현용 더미 데이터입니다.
 * 날짜는 "실제 오늘"과 "이번 달"을 기준으로 동적으로 생성되므로,
 * 언제 실행해도 오늘/내일에 일정이 채워져 보입니다.
 *
 * 나중에 실제 데이터(API/DB)를 붙일 때는 이 파일의 `events` 배열만
 * 실제 소스로 교체하면 되고, 타입(CalendarEvent)은 그대로 재사용할 수 있습니다.
 */

import { TODAY, addDays, dayOfViewMonth } from "@/lib/calendar";

/** 이벤트 강조색 — globals.css 의 --color-ev-* 토큰과 1:1 대응 */
export type EventColor = "blue" | "pink" | "purple" | "red" | "teal";

/** 캘린더 칸에서의 표시 방식: filled(채운 알약) / line(좌측 바 + 텍스트) */
export type ChipStyle = "filled" | "line";

export interface CalendarEvent {
  id: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  date: string;
  title: string;
  color: EventColor;
  /** 월간 칸에서의 칩 스타일 (기본 line) */
  chip?: ChipStyle;
  /** 시작 시각 "HH:mm" (선택) */
  startTime?: string;
  /** 종료 시각 "HH:mm" (선택) */
  endTime?: string;
  /** 장소 (선택) */
  location?: string;
  /** 회의 링크 (선택) */
  link?: string;
  /** 참석자 수 — 우측 아젠다 카드의 아바타 그룹 표시용 (선택) */
  attendeeCount?: number;
}

const today = TODAY;
const tomorrow = addDays(TODAY, 1);

export const events: CalendarEvent[] = [
  // ── 오늘 (아젠다 + 월간 칩) ───────────────────────
  {
    id: "t1",
    date: today,
    title: "그룹A 리서치",
    color: "blue",
    chip: "line",
    startTime: "10:30",
    endTime: "13:00",
    location: "UT룸",
  },
  {
    id: "t2",
    date: today,
    title: "스크리닝 세션",
    color: "purple",
    chip: "line",
    startTime: "13:30",
    endTime: "16:00",
    location: "내 자리",
    link: "https://asdf-ac-kr.zoom.us/j/8814790260...",
    attendeeCount: 6,
  },
  {
    id: "t3",
    date: today,
    title: "그룹A 리서치",
    color: "pink",
    startTime: "10:30",
    endTime: "13:00",
    location: "UT룸",
  },
  {
    id: "t4",
    date: today,
    title: "그룹A 리서치",
    color: "purple",
    startTime: "10:30",
    endTime: "13:00",
    location: "UT룸",
  },

  // ── 내일 (아젠다 + 월간 칩) ───────────────────────
  {
    id: "m1",
    date: tomorrow,
    title: "그룹A 리서치",
    color: "blue",
    chip: "line",
    startTime: "10:30",
    endTime: "13:00",
    location: "UT룸",
  },
  {
    id: "m2",
    date: tomorrow,
    title: "스크리닝 세션",
    color: "purple",
    startTime: "13:30",
    endTime: "16:00",
    location: "내 자리",
    link: "https://asdf-ac-kr.zoom.us/j/8814790260...",
    attendeeCount: 3,
  },

  // ── 이번 달 곳곳의 더미 일정 (월간 뷰 밀도용) ──────
  { id: "d01", date: dayOfViewMonth(1), title: "디자인팀 회의", color: "pink", chip: "filled" },
  { id: "d02", date: dayOfViewMonth(3), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d03", date: dayOfViewMonth(3), title: "디자인팀 회의", color: "pink", chip: "filled" },
  { id: "d04", date: dayOfViewMonth(5), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d05", date: dayOfViewMonth(5), title: "디자인팀 회의", color: "purple", chip: "line" },
  { id: "d06", date: dayOfViewMonth(11), title: "디자인팀 회의", color: "red", chip: "filled" },
  { id: "d07", date: dayOfViewMonth(13), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d08", date: dayOfViewMonth(14), title: "디자인팀 회의", color: "blue", chip: "line" },
  { id: "d09", date: dayOfViewMonth(14), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d10", date: dayOfViewMonth(14), title: "디자인팀 회의", color: "purple", chip: "line" },
  { id: "d11", date: dayOfViewMonth(14), title: "디자인팀 회의", color: "pink", chip: "line" },
  { id: "d12", date: dayOfViewMonth(19), title: "디자인팀 회의", color: "blue", chip: "line" },
  { id: "d13", date: dayOfViewMonth(19), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d14", date: dayOfViewMonth(23), title: "디자인팀 회의", color: "red", chip: "line" },
  { id: "d15", date: dayOfViewMonth(23), title: "디자인팀 회의", color: "purple", chip: "line" },
  { id: "d16", date: dayOfViewMonth(23), title: "디자인팀 회의", color: "blue", chip: "line" },
  { id: "d17", date: dayOfViewMonth(27), title: "디자인팀 회의", color: "blue", chip: "filled" },
  { id: "d18", date: dayOfViewMonth(27), title: "디자인팀 회의", color: "pink", chip: "line" },
  { id: "d19", date: dayOfViewMonth(27), title: "디자인팀 회의", color: "purple", chip: "line" },
];

/** 특정 날짜의 이벤트 목록 */
export function eventsByDate(date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

/** 우측 아젠다에 노출할 날짜들 (오늘, 내일) */
export const AGENDA_DATES = [today, tomorrow] as const;
