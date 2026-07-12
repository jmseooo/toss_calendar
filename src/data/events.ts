/**
 * 일정(이벤트) 데이터.
 *
 * 출처: Design_Team_Calendar_300_Events.xlsx (디자인팀 일정 300건).
 *
 * 7월은 기존 Figma 시안의 배치를 그대로 유지합니다 — 일정이 놓이는 날짜,
 * 날짜별 개수, 각 칩의 색상과 스타일(filled/line)이 모두 시안과 동일하고,
 * 제목·시간·장소만 실제 데이터로 채웠습니다.
 *
 * 나머지 274건은 시안과 같은 리듬으로 2026년 3~12월에 나눠 담았습니다.
 * 한 달에 10~11일만 일정이 있고, 하루에 1~5건이 몰리며, 주말은 달마다
 * 1~2일에만 워크숍·세미나·릴리즈 체크처럼 주말에 있어도 자연스러운 일정이
 * 놓입니다. 데일리 스탠드업은 평일에만 하루 한 번씩 들어갑니다.
 *
 * 날짜는 고정 값입니다(더 이상 오늘 기준으로 계산하지 않음).
 * 실제 데이터(API/DB)를 붙일 때는 `events` 배열만 교체하면 되고,
 * 타입(CalendarEvent)은 그대로 재사용할 수 있습니다.
 */

import { TODAY, addDays } from "@/lib/calendar";

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
  /** 시작 시각 "HH:mm" — 종일(filled) 일정에는 없음 */
  startTime?: string;
  /** 종료 시각 "HH:mm" — 종일(filled) 일정에는 없음 */
  endTime?: string;
  /** 장소 (선택) */
  location?: string;
  /** 회의 링크 (선택) */
  link?: string;
  /** 참석자 수 — 우측 아젠다 카드의 아바타 그룹 표시용 (선택) */
  attendeeCount?: number;
  /** 아직 참석 확정 전의 임시(가) 일정 — 주황 점선 카드로 그린다 (선택) */
  tentative?: boolean;
  /** 임시 일정을 "참석"으로 수락함 — 점선 대신 진한 채움 카드로 그린다 (선택) */
  accepted?: boolean;
}

export const events: CalendarEvent[] = [
  // ── 2026년 3월 ──────────────────────────────────────
  { id: "e001", date: "2026-03-01", title: "벤치마킹 세션 · 프로젝트 Lime", color: "pink", chip: "line", startTime: "14:00", endTime: "15:00", location: "Zoom", attendeeCount: 4 },
  { id: "e002", date: "2026-03-03", title: "앱 아이콘 검토 · 프로젝트 Orion", color: "pink", chip: "line", startTime: "11:30", endTime: "12:00", location: "Focus Room 2" },
  { id: "e003", date: "2026-03-03", title: "주간 디자인 미팅", color: "red", chip: "line", startTime: "16:30", endTime: "18:00", location: "Design Studio", attendeeCount: 8 },
  { id: "e004", date: "2026-03-05", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e005", date: "2026-03-05", title: "개발 핸드오프", color: "purple", chip: "line", startTime: "14:30", endTime: "15:30", location: "미팅룸 A", attendeeCount: 8 },
  { id: "e006", date: "2026-03-05", title: "마케팅 배너 검토 · 프로젝트 Nova", color: "teal", chip: "line", startTime: "15:00", endTime: "15:30", location: "라운지" },
  { id: "e007", date: "2026-03-10", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e008", date: "2026-03-10", title: "일러스트 검토 · 프로젝트 Atlas", color: "purple", chip: "line", startTime: "16:30", endTime: "18:00", location: "라운지", attendeeCount: 6 },
  { id: "e009", date: "2026-03-11", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e010", date: "2026-03-11", title: "디자인 QA", color: "red", chip: "line", startTime: "10:00", endTime: "10:30", location: "Google Meet" },
  { id: "e011", date: "2026-03-11", title: "컬러 시스템 리뷰", color: "blue", chip: "line", startTime: "11:00", endTime: "11:30", location: "미팅룸 B" },
  { id: "e012", date: "2026-03-11", title: "월간 디자인 리뷰", color: "purple", chip: "line", startTime: "11:30", endTime: "13:00", location: "Design Studio", attendeeCount: 5 },
  { id: "e013", date: "2026-03-11", title: "1:1 미팅 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "17:30", endTime: "19:00", location: "Focus Room 2", attendeeCount: 4 },
  { id: "e014", date: "2026-03-13", title: "리서치 결과 공유", color: "red", chip: "line", startTime: "10:30", endTime: "12:00", location: "Design Studio", attendeeCount: 7 },
  { id: "e015", date: "2026-03-13", title: "디자인팀 데일리 스탠드업 · 프로젝트 Atlas", color: "red", chip: "line", startTime: "11:00", endTime: "11:30", location: "프로젝트룸" },
  { id: "e016", date: "2026-03-13", title: "디자인 QA 점검", color: "blue", chip: "line", startTime: "14:30", endTime: "15:30", location: "Focus Room 2", attendeeCount: 3 },
  { id: "e017", date: "2026-03-13", title: "브랜드 디자인 리뷰", color: "purple", chip: "line", startTime: "14:30", endTime: "16:00", location: "Design Studio", attendeeCount: 5 },
  { id: "e018", date: "2026-03-14", title: "디자인 시스템 작업 · 프로젝트 Pulse", color: "pink", chip: "line", startTime: "13:30", endTime: "14:30", location: "디자인룸", attendeeCount: 7 },
  { id: "e019", date: "2026-03-19", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e020", date: "2026-03-19", title: "앱 아이콘 검토", color: "red", chip: "line", startTime: "11:00", endTime: "12:00", location: "미팅룸 B", attendeeCount: 6 },
  { id: "e021", date: "2026-03-19", title: "일러스트 검토", color: "red", chip: "line", startTime: "17:00", endTime: "18:30", location: "Google Meet", attendeeCount: 6 },
  { id: "e022", date: "2026-03-23", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e023", date: "2026-03-23", title: "디자인 QA 점검 · 프로젝트 Lime", color: "blue", chip: "line", startTime: "14:00", endTime: "15:30", location: "디자인룸", attendeeCount: 4 },
  { id: "e024", date: "2026-03-23", title: "프로젝트 킥오프", color: "blue", chip: "line", startTime: "17:00", endTime: "18:00", location: "미팅룸 A", attendeeCount: 4 },
  { id: "e025", date: "2026-03-27", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e026", date: "2026-03-27", title: "1:1 미팅", color: "purple", chip: "line", startTime: "13:00", endTime: "14:00", location: "미팅룸 B", attendeeCount: 4 },
  { id: "e027", date: "2026-03-27", title: "디자인 QA", color: "pink", chip: "line", startTime: "13:00", endTime: "13:30", location: "Zoom" },
  { id: "e028", date: "2026-03-27", title: "디자인 시스템 회의", color: "red", chip: "line", startTime: "13:00", endTime: "14:00", location: "미팅룸 A", attendeeCount: 4 },
  { id: "e029", date: "2026-03-30", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e030", date: "2026-03-30", title: "디자인 시스템 회의 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "14:30", endTime: "15:30", location: "미팅룸 B", attendeeCount: 8 },
  { id: "e031", date: "2026-03-30", title: "컴포넌트 설계 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "17:30", endTime: "19:00", location: "Design Studio", attendeeCount: 5 },

  // ── 2026년 4월 ──────────────────────────────────────
  { id: "e032", date: "2026-04-01", title: "디자인팀 데일리 스탠드업", color: "teal", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e033", date: "2026-04-01", title: "PM 요구사항 미팅", color: "blue", chip: "line", startTime: "10:30", endTime: "11:30", location: "라운지", attendeeCount: 3 },
  { id: "e034", date: "2026-04-01", title: "UX 플로우 검토", color: "purple", chip: "line", startTime: "13:30", endTime: "15:00", location: "Focus Room 2", attendeeCount: 3 },
  { id: "e035", date: "2026-04-03", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e036", date: "2026-04-03", title: "UX Writing 검토 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "14:30", endTime: "15:00", location: "Zoom" },
  { id: "e037", date: "2026-04-05", title: "랜딩페이지 디자인", color: "blue", chip: "line", startTime: "11:00", endTime: "11:30", location: "Focus Room 1" },
  { id: "e038", date: "2026-04-10", title: "QA 이슈 확인", color: "red", chip: "line", startTime: "13:00", endTime: "14:00", location: "Design Studio", attendeeCount: 6 },
  { id: "e039", date: "2026-04-10", title: "UI 시안 리뷰", color: "purple", chip: "line", startTime: "17:30", endTime: "19:00", location: "Zoom", attendeeCount: 7 },
  { id: "e040", date: "2026-04-11", title: "아이콘 디자인 작업 · 프로젝트 Lime", color: "red", chip: "line", startTime: "17:00", endTime: "17:30", location: "Focus Room 1" },
  { id: "e041", date: "2026-04-13", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e042", date: "2026-04-13", title: "월간 디자인 리뷰 · 프로젝트 Pulse", color: "pink", chip: "line", startTime: "10:00", endTime: "11:00", location: "Focus Room 1", attendeeCount: 6 },
  { id: "e043", date: "2026-04-13", title: "UI 시안 리뷰 · 프로젝트 Orion", color: "red", chip: "line", startTime: "13:30", endTime: "14:00", location: "프로젝트룸" },
  { id: "e044", date: "2026-04-13", title: "유저 인터뷰", color: "purple", chip: "line", startTime: "13:30", endTime: "14:00", location: "프로젝트룸" },
  { id: "e045", date: "2026-04-13", title: "디자인 QA 점검", color: "blue", chip: "line", startTime: "14:00", endTime: "14:30", location: "Zoom" },
  { id: "e046", date: "2026-04-14", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e047", date: "2026-04-14", title: "QA 이슈 확인", color: "blue", chip: "line", startTime: "11:00", endTime: "12:30", location: "Focus Room 1", attendeeCount: 3 },
  { id: "e048", date: "2026-04-14", title: "UI 시안 리뷰 · 프로젝트 Nova", color: "red", chip: "line", startTime: "15:00", endTime: "16:00", location: "프로젝트룸", attendeeCount: 4 },
  { id: "e049", date: "2026-04-14", title: "디자인 QA 점검", color: "purple", chip: "line", startTime: "17:30", endTime: "19:00", location: "Design Studio", attendeeCount: 6 },
  { id: "e050", date: "2026-04-20", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e051", date: "2026-04-20", title: "일러스트 검토", color: "pink", chip: "line", startTime: "11:00", endTime: "12:00", location: "Focus Room 2", attendeeCount: 6 },
  { id: "e052", date: "2026-04-23", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e053", date: "2026-04-23", title: "PM 요구사항 미팅 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "15:30", endTime: "17:00", location: "라운지", attendeeCount: 7 },
  { id: "e054", date: "2026-04-23", title: "컴포넌트 설계", color: "pink", chip: "line", startTime: "16:00", endTime: "17:30", location: "Focus Room 1", attendeeCount: 3 },
  { id: "e055", date: "2026-04-27", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e056", date: "2026-04-27", title: "일러스트 검토 · 프로젝트 Orion", color: "teal", chip: "line", startTime: "14:30", endTime: "15:00", location: "디자인룸" },
  { id: "e057", date: "2026-04-27", title: "디자인 크리틱", color: "red", chip: "line", startTime: "15:30", endTime: "17:00", location: "Focus Room 2", attendeeCount: 6 },
  { id: "e058", date: "2026-04-27", title: "1:1 미팅 · 프로젝트 Nova", color: "purple", chip: "line", startTime: "16:00", endTime: "17:30", location: "라운지", attendeeCount: 6 },
  { id: "e059", date: "2026-04-30", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e060", date: "2026-04-30", title: "디자인 QA 점검", color: "purple", chip: "line", startTime: "15:00", endTime: "16:30", location: "프로젝트룸", attendeeCount: 5 },
  { id: "e061", date: "2026-04-30", title: "스프린트 플래닝", color: "pink", chip: "line", startTime: "17:30", endTime: "18:00", location: "프로젝트룸" },

  // ── 2026년 5월 ──────────────────────────────────────
  { id: "e062", date: "2026-05-01", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e063", date: "2026-05-03", title: "아이콘 디자인 작업 · 프로젝트 Atlas", color: "purple", chip: "line", startTime: "14:30", endTime: "16:00", location: "라운지", attendeeCount: 4 },
  { id: "e064", date: "2026-05-03", title: "릴리즈 체크 · 프로젝트 Atlas", color: "blue", chip: "line", startTime: "15:30", endTime: "17:00", location: "Focus Room 2", attendeeCount: 7 },
  { id: "e065", date: "2026-05-05", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e066", date: "2026-05-05", title: "QA 이슈 확인", color: "red", chip: "line", startTime: "16:00", endTime: "16:30", location: "미팅룸 B" },
  { id: "e067", date: "2026-05-05", title: "프로토타입 피드백", color: "blue", chip: "line", startTime: "17:30", endTime: "18:30", location: "디자인룸", attendeeCount: 6 },
  { id: "e068", date: "2026-05-10", title: "AI 디자인 툴 스터디", color: "red", chip: "filled", location: "Zoom" },
  { id: "e069", date: "2026-05-10", title: "랜딩페이지 디자인 · 프로젝트 Nova", color: "purple", chip: "line", startTime: "11:30", endTime: "12:30", location: "Focus Room 1", attendeeCount: 8 },
  { id: "e070", date: "2026-05-11", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e071", date: "2026-05-11", title: "Lottie 애니메이션 검토 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "11:30", endTime: "12:30", location: "Design Studio", attendeeCount: 5 },
  { id: "e072", date: "2026-05-11", title: "타이포그래피 검토", color: "blue", chip: "line", startTime: "13:30", endTime: "14:30", location: "미팅룸 B", attendeeCount: 5 },
  { id: "e073", date: "2026-05-11", title: "프로토타입 피드백", color: "red", chip: "line", startTime: "13:30", endTime: "14:30", location: "디자인룸", attendeeCount: 6 },
  { id: "e074", date: "2026-05-11", title: "스프린트 플래닝", color: "red", chip: "line", startTime: "14:30", endTime: "15:00", location: "디자인룸" },
  { id: "e075", date: "2026-05-13", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e076", date: "2026-05-14", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e077", date: "2026-05-14", title: "신입 디자이너 온보딩 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "14:30", endTime: "15:00", location: "Google Meet" },
  { id: "e078", date: "2026-05-14", title: "유저 인터뷰", color: "purple", chip: "line", startTime: "14:30", endTime: "15:30", location: "Zoom", attendeeCount: 8 },
  { id: "e079", date: "2026-05-14", title: "온보딩 화면 검토", color: "pink", chip: "line", startTime: "15:00", endTime: "16:30", location: "미팅룸 B", attendeeCount: 6 },
  { id: "e080", date: "2026-05-19", title: "마케팅 배너 검토", color: "red", chip: "line", startTime: "10:30", endTime: "11:30", location: "디자인룸", attendeeCount: 7 },
  { id: "e081", date: "2026-05-19", title: "온보딩 화면 검토", color: "pink", chip: "line", startTime: "11:30", endTime: "13:00", location: "Focus Room 1", attendeeCount: 8 },
  { id: "e082", date: "2026-05-19", title: "고객 피드백 리뷰 · 프로젝트 Pulse", color: "red", chip: "line", startTime: "13:00", endTime: "14:30", location: "Google Meet", attendeeCount: 4 },
  { id: "e083", date: "2026-05-22", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e084", date: "2026-05-22", title: "UI 시안 리뷰", color: "blue", chip: "line", startTime: "11:30", endTime: "12:30", location: "Design Studio", attendeeCount: 4 },
  { id: "e085", date: "2026-05-22", title: "디자인 시스템 회의", color: "teal", chip: "line", startTime: "15:30", endTime: "16:00", location: "Focus Room 1" },
  { id: "e086", date: "2026-05-27", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e087", date: "2026-05-27", title: "온보딩 화면 검토", color: "blue", chip: "line", startTime: "11:00", endTime: "11:30", location: "Design Studio" },
  { id: "e088", date: "2026-05-27", title: "디자인 시스템 회의 · 프로젝트 Orion", color: "pink", chip: "line", startTime: "16:30", endTime: "17:00", location: "미팅룸 B" },
  { id: "e089", date: "2026-05-27", title: "컬러 시스템 리뷰", color: "purple", chip: "line", startTime: "17:00", endTime: "18:30", location: "Design Studio", attendeeCount: 4 },
  { id: "e090", date: "2026-05-29", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e091", date: "2026-05-29", title: "온보딩 화면 검토 · 프로젝트 Nova", color: "red", chip: "line", startTime: "14:00", endTime: "15:30", location: "미팅룸 A", attendeeCount: 6 },
  { id: "e092", date: "2026-05-29", title: "주간 디자인 미팅 · 프로젝트 Atlas", color: "red", chip: "line", startTime: "16:00", endTime: "17:00", location: "Focus Room 2", attendeeCount: 8 },

  // ── 2026년 6월 ──────────────────────────────────────
  { id: "e093", date: "2026-06-01", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e094", date: "2026-06-01", title: "프로젝트 킥오프", color: "red", chip: "line", startTime: "10:30", endTime: "11:30", location: "Design Studio", attendeeCount: 8 },
  { id: "e095", date: "2026-06-01", title: "사용성 테스트", color: "purple", chip: "line", startTime: "15:30", endTime: "16:30", location: "Google Meet", attendeeCount: 8 },
  { id: "e096", date: "2026-06-01", title: "고객 피드백 리뷰 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "17:00", endTime: "18:00", location: "Focus Room 2", attendeeCount: 5 },
  { id: "e097", date: "2026-06-03", title: "UX 플로우 검토", color: "red", chip: "line", startTime: "10:00", endTime: "11:30", location: "Focus Room 2", attendeeCount: 6 },
  { id: "e098", date: "2026-06-03", title: "디자인팀 데일리 스탠드업 · 프로젝트 Atlas", color: "blue", chip: "line", startTime: "17:30", endTime: "18:00", location: "미팅룸 B" },
  { id: "e099", date: "2026-06-05", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e100", date: "2026-06-05", title: "컬러 시스템 리뷰", color: "purple", chip: "line", startTime: "15:30", endTime: "17:00", location: "라운지", attendeeCount: 3 },
  { id: "e101", date: "2026-06-05", title: "사용성 테스트", color: "blue", chip: "line", startTime: "16:00", endTime: "16:30", location: "Focus Room 1" },
  { id: "e102", date: "2026-06-10", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e103", date: "2026-06-10", title: "와이어프레임 리뷰", color: "pink", chip: "line", startTime: "13:00", endTime: "13:30", location: "디자인룸" },
  { id: "e104", date: "2026-06-11", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e105", date: "2026-06-11", title: "프로젝트 킥오프", color: "red", chip: "line", startTime: "10:30", endTime: "11:00", location: "디자인룸" },
  { id: "e106", date: "2026-06-11", title: "와이어프레임 리뷰", color: "pink", chip: "line", startTime: "16:00", endTime: "17:30", location: "Google Meet", attendeeCount: 3 },
  { id: "e107", date: "2026-06-11", title: "UX Writing 검토 · 프로젝트 Lime", color: "red", chip: "line", startTime: "17:00", endTime: "18:30", location: "Design Studio", attendeeCount: 8 },
  { id: "e108", date: "2026-06-11", title: "팀 점심", color: "pink", chip: "line", startTime: "17:30", endTime: "19:00", location: "Focus Room 1", attendeeCount: 6 },
  { id: "e109", date: "2026-06-13", title: "디자인 시스템 작업", color: "purple", chip: "line", startTime: "11:00", endTime: "12:30", location: "Zoom", attendeeCount: 7 },
  { id: "e110", date: "2026-06-14", title: "Figma Variables 워크숍 · 프로젝트 Canvas", color: "teal", chip: "filled", location: "Design Studio" },
  { id: "e111", date: "2026-06-19", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e112", date: "2026-06-19", title: "프로토타입 피드백 · 프로젝트 Atlas", color: "purple", chip: "line", startTime: "13:30", endTime: "15:00", location: "프로젝트룸", attendeeCount: 4 },
  { id: "e113", date: "2026-06-23", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e114", date: "2026-06-23", title: "컴포넌트 설계", color: "purple", chip: "line", startTime: "14:00", endTime: "14:30", location: "Focus Room 2" },
  { id: "e115", date: "2026-06-23", title: "월간 디자인 리뷰", color: "blue", chip: "line", startTime: "16:30", endTime: "17:00", location: "프로젝트룸" },
  { id: "e116", date: "2026-06-26", title: "UX Writing 검토 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "13:00", endTime: "13:30", location: "Google Meet" },
  { id: "e117", date: "2026-06-26", title: "모션 디자인 리뷰 · 프로젝트 Pulse", color: "red", chip: "line", startTime: "15:30", endTime: "16:00", location: "미팅룸 B" },
  { id: "e118", date: "2026-06-26", title: "접근성 리뷰", color: "purple", chip: "line", startTime: "17:00", endTime: "18:00", location: "디자인룸", attendeeCount: 6 },
  { id: "e119", date: "2026-06-26", title: "와이어프레임 리뷰", color: "blue", chip: "line", startTime: "17:30", endTime: "18:30", location: "Focus Room 2", attendeeCount: 4 },
  { id: "e120", date: "2026-06-30", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e121", date: "2026-06-30", title: "와이어프레임 리뷰 · 프로젝트 Atlas", color: "pink", chip: "line", startTime: "10:30", endTime: "11:30", location: "미팅룸 B", attendeeCount: 7 },
  { id: "e122", date: "2026-06-30", title: "접근성 리뷰", color: "purple", chip: "line", startTime: "15:30", endTime: "16:00", location: "디자인룸" },

  // ── 2026년 7월 ──────────────────────────────────────
  { id: "e123", date: "2026-07-01", title: "사내 디자인 세미나 · 프로젝트 Orion", color: "pink", chip: "filled", location: "미팅룸 A" },
  { id: "e124", date: "2026-07-03", title: "사내 디자인 세미나 · 프로젝트 Pulse", color: "pink", chip: "filled", location: "Design Studio" },
  { id: "e125", date: "2026-07-03", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e126", date: "2026-07-05", title: "피그마 라이브 작업", color: "red", chip: "line", startTime: "16:00", endTime: "16:30", location: "Zoom" },
  { id: "e127", date: "2026-07-05", title: "릴리즈 체크", color: "purple", chip: "line", startTime: "17:30", endTime: "18:30", location: "디자인룸", attendeeCount: 3 },
  { id: "e128", date: "2026-07-10", title: "Figma Variables 워크숍", color: "teal", chip: "filled", location: "Zoom" },
  { id: "e129", date: "2026-07-10", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e130", date: "2026-07-10", title: "프로젝트 킥오프", color: "blue", chip: "line", startTime: "10:30", endTime: "11:00", location: "디자인룸" },
  { id: "e131", date: "2026-07-10", title: "팀 점심", color: "purple", chip: "line", startTime: "14:30", endTime: "15:30", location: "프로젝트룸", attendeeCount: 5 },
  { id: "e132", date: "2026-07-10", title: "UX 플로우 검토 · 프로젝트 Lime", color: "pink", chip: "line", startTime: "15:30", endTime: "17:00", location: "디자인룸", attendeeCount: 5 },
  { id: "e133", date: "2026-07-11", title: "사내 디자인 세미나", color: "red", chip: "filled", location: "프로젝트룸" },
  { id: "e134", date: "2026-07-11", title: "릴리즈 체크", color: "blue", chip: "line", startTime: "13:30", endTime: "15:00", location: "Zoom", attendeeCount: 4 },
  { id: "e135", date: "2026-07-11", title: "포트폴리오 리뷰 · 프로젝트 Lime", color: "purple", chip: "line", startTime: "13:30", endTime: "14:30", location: "디자인룸", attendeeCount: 7 },
  { id: "e136", date: "2026-07-13", title: "유저 인터뷰", color: "red", chip: "line", startTime: "10:00", endTime: "11:30", location: "프로젝트룸", attendeeCount: 6 },
  { id: "e137", date: "2026-07-14", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e138", date: "2026-07-14", title: "유저 인터뷰", color: "blue", chip: "line", startTime: "11:00", endTime: "12:00", location: "Google Meet", attendeeCount: 8 },
  { id: "e139", date: "2026-07-14", title: "디자인 리드 리뷰 · 프로젝트 Nova", color: "red", chip: "line", startTime: "14:00", endTime: "15:00", location: "라운지", attendeeCount: 6 },
  { id: "e140", date: "2026-07-14", title: "와이어프레임 리뷰 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "17:30", endTime: "18:00", location: "미팅룸 A" },
  { id: "e141", date: "2026-07-19", title: "릴리즈 체크", color: "blue", chip: "line", startTime: "13:30", endTime: "15:00", location: "Design Studio", attendeeCount: 5 },
  { id: "e142", date: "2026-07-19", title: "피그마 라이브 작업", color: "red", chip: "line", startTime: "15:30", endTime: "16:00", location: "미팅룸 A" },
  { id: "e143", date: "2026-07-23", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e144", date: "2026-07-23", title: "신입 디자이너 온보딩 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "10:30", endTime: "11:00", location: "Focus Room 1" },
  { id: "e145", date: "2026-07-23", title: "최종 시안 승인", color: "purple", chip: "line", startTime: "11:30", endTime: "12:30", location: "프로젝트룸", attendeeCount: 5 },
  { id: "e146", date: "2026-07-27", title: "Figma Variables 워크숍 · 프로젝트 Orion", color: "blue", chip: "filled", location: "미팅룸 B" },
  { id: "e147", date: "2026-07-27", title: "접근성 리뷰", color: "pink", chip: "line", startTime: "10:30", endTime: "11:00", location: "Zoom" },
  { id: "e148", date: "2026-07-27", title: "컬러 시스템 리뷰 · 프로젝트 Atlas", color: "purple", chip: "line", startTime: "15:00", endTime: "16:00", location: "프로젝트룸", attendeeCount: 4 },

  // ── 2026년 8월 ──────────────────────────────────────
  { id: "e149", date: "2026-08-01", title: "포트폴리오 리뷰", color: "blue", chip: "line", startTime: "17:00", endTime: "18:30", location: "Focus Room 1", attendeeCount: 3 },
  { id: "e150", date: "2026-08-03", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e151", date: "2026-08-03", title: "프로젝트 킥오프", color: "red", chip: "line", startTime: "13:00", endTime: "13:30", location: "Design Studio" },
  { id: "e152", date: "2026-08-05", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e153", date: "2026-08-05", title: "리서치 결과 공유 · 프로젝트 Canvas", color: "blue", chip: "line", startTime: "14:00", endTime: "15:00", location: "Focus Room 2", attendeeCount: 4 },
  { id: "e154", date: "2026-08-05", title: "최종 시안 승인", color: "blue", chip: "line", startTime: "15:30", endTime: "16:30", location: "Focus Room 2", attendeeCount: 8 },
  { id: "e155", date: "2026-08-10", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e156", date: "2026-08-10", title: "브랜드 디자인 리뷰", color: "purple", chip: "line", startTime: "11:00", endTime: "12:30", location: "Design Studio", attendeeCount: 6 },
  { id: "e157", date: "2026-08-11", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e158", date: "2026-08-11", title: "UX 플로우 검토", color: "red", chip: "line", startTime: "11:30", endTime: "12:00", location: "미팅룸 A" },
  { id: "e159", date: "2026-08-11", title: "타이포그래피 검토", color: "red", chip: "line", startTime: "14:00", endTime: "14:30", location: "Focus Room 2" },
  { id: "e160", date: "2026-08-11", title: "디자인 시스템 회의", color: "purple", chip: "line", startTime: "15:30", endTime: "17:00", location: "Focus Room 1", attendeeCount: 4 },
  { id: "e161", date: "2026-08-11", title: "최종 시안 승인", color: "pink", chip: "line", startTime: "16:30", endTime: "17:00", location: "프로젝트룸" },
  { id: "e162", date: "2026-08-13", title: "디자인팀 데일리 스탠드업", color: "teal", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e163", date: "2026-08-13", title: "최종 시안 승인", color: "blue", chip: "line", startTime: "13:30", endTime: "15:00", location: "Focus Room 1", attendeeCount: 5 },
  { id: "e164", date: "2026-08-13", title: "브랜드 디자인 리뷰", color: "purple", chip: "line", startTime: "14:00", endTime: "14:30", location: "미팅룸 A" },
  { id: "e165", date: "2026-08-14", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e166", date: "2026-08-14", title: "프로토타입 피드백", color: "blue", chip: "line", startTime: "13:00", endTime: "14:30", location: "Google Meet", attendeeCount: 3 },
  { id: "e167", date: "2026-08-14", title: "디자인 QA", color: "purple", chip: "line", startTime: "13:30", endTime: "14:00", location: "라운지" },
  { id: "e168", date: "2026-08-14", title: "리서치 결과 공유 · 프로젝트 Canvas", color: "purple", chip: "line", startTime: "15:30", endTime: "16:00", location: "Focus Room 1" },
  { id: "e169", date: "2026-08-19", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e170", date: "2026-08-19", title: "개발 핸드오프", color: "red", chip: "line", startTime: "13:30", endTime: "14:30", location: "디자인룸", attendeeCount: 5 },
  { id: "e171", date: "2026-08-19", title: "프로토타입 피드백 · 프로젝트 Nova", color: "blue", chip: "line", startTime: "13:30", endTime: "14:00", location: "Focus Room 2" },
  { id: "e172", date: "2026-08-23", title: "포트폴리오 리뷰", color: "red", chip: "line", startTime: "13:00", endTime: "13:30", location: "Design Studio" },
  { id: "e173", date: "2026-08-27", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e174", date: "2026-08-27", title: "최종 시안 승인 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "11:00", endTime: "12:30", location: "Focus Room 1", attendeeCount: 6 },
  { id: "e175", date: "2026-08-27", title: "1:1 미팅 · 프로젝트 Pulse", color: "pink", chip: "line", startTime: "14:30", endTime: "15:00", location: "Focus Room 2" },
  { id: "e176", date: "2026-08-27", title: "디자인 크리틱 · 프로젝트 Lime", color: "blue", chip: "line", startTime: "17:30", endTime: "18:00", location: "Zoom" },
  { id: "e177", date: "2026-08-31", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e178", date: "2026-08-31", title: "스프린트 회고", color: "purple", chip: "line", startTime: "14:00", endTime: "15:00", location: "라운지", attendeeCount: 7 },
  { id: "e179", date: "2026-08-31", title: "Lottie 애니메이션 검토", color: "blue", chip: "line", startTime: "16:00", endTime: "17:30", location: "Google Meet", attendeeCount: 4 },

  // ── 2026년 9월 ──────────────────────────────────────
  { id: "e180", date: "2026-09-01", title: "타이포그래피 검토 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "10:30", endTime: "11:00", location: "프로젝트룸" },
  { id: "e181", date: "2026-09-01", title: "최종 시안 승인", color: "purple", chip: "line", startTime: "11:30", endTime: "12:30", location: "미팅룸 A", attendeeCount: 5 },
  { id: "e182", date: "2026-09-01", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "14:00", endTime: "15:30", location: "Focus Room 2" },
  { id: "e183", date: "2026-09-03", title: "Lottie 애니메이션 검토", color: "red", chip: "line", startTime: "10:00", endTime: "10:30", location: "Focus Room 1" },
  { id: "e184", date: "2026-09-03", title: "마케팅 배너 검토", color: "pink", chip: "line", startTime: "17:30", endTime: "18:00", location: "디자인룸" },
  { id: "e185", date: "2026-09-05", title: "릴리즈 체크", color: "pink", chip: "line", startTime: "13:00", endTime: "13:30", location: "Design Studio" },
  { id: "e186", date: "2026-09-10", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e187", date: "2026-09-10", title: "개발팀 싱크", color: "purple", chip: "line", startTime: "14:00", endTime: "14:30", location: "Focus Room 2" },
  { id: "e188", date: "2026-09-11", title: "디자인팀 데일리 스탠드업", color: "teal", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e189", date: "2026-09-11", title: "와이어프레임 리뷰 · 프로젝트 Lime", color: "blue", chip: "line", startTime: "14:00", endTime: "15:30", location: "디자인룸", attendeeCount: 8 },
  { id: "e190", date: "2026-09-11", title: "일러스트 검토", color: "purple", chip: "line", startTime: "14:00", endTime: "14:30", location: "라운지" },
  { id: "e191", date: "2026-09-11", title: "접근성 리뷰 · 프로젝트 Canvas", color: "purple", chip: "line", startTime: "14:30", endTime: "15:00", location: "Google Meet" },
  { id: "e192", date: "2026-09-11", title: "릴리즈 체크", color: "pink", chip: "line", startTime: "17:00", endTime: "18:30", location: "라운지", attendeeCount: 8 },
  { id: "e193", date: "2026-09-13", title: "포트폴리오 리뷰", color: "blue", chip: "line", startTime: "14:30", endTime: "15:00", location: "디자인룸" },
  { id: "e194", date: "2026-09-14", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e195", date: "2026-09-14", title: "디자인 QA · 프로젝트 Atlas", color: "blue", chip: "line", startTime: "10:30", endTime: "11:00", location: "Design Studio" },
  { id: "e196", date: "2026-09-14", title: "사용성 테스트", color: "red", chip: "line", startTime: "14:30", endTime: "16:00", location: "미팅룸 B", attendeeCount: 7 },
  { id: "e197", date: "2026-09-14", title: "일러스트 검토", color: "red", chip: "line", startTime: "15:30", endTime: "17:00", location: "디자인룸", attendeeCount: 8 },
  { id: "e198", date: "2026-09-18", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e199", date: "2026-09-18", title: "고객 피드백 리뷰", color: "purple", chip: "line", startTime: "15:00", endTime: "16:00", location: "디자인룸", attendeeCount: 6 },
  { id: "e200", date: "2026-09-23", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e201", date: "2026-09-23", title: "QA 이슈 확인", color: "blue", chip: "line", startTime: "15:30", endTime: "16:30", location: "미팅룸 A", attendeeCount: 7 },
  { id: "e202", date: "2026-09-23", title: "UI 시안 리뷰", color: "red", chip: "line", startTime: "16:00", endTime: "17:30", location: "미팅룸 A", attendeeCount: 8 },
  { id: "e203", date: "2026-09-28", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e204", date: "2026-09-28", title: "월간 디자인 리뷰", color: "purple", chip: "line", startTime: "11:30", endTime: "12:00", location: "미팅룸 A" },
  { id: "e205", date: "2026-09-28", title: "디자인 크리틱", color: "blue", chip: "line", startTime: "15:00", endTime: "16:30", location: "미팅룸 A", attendeeCount: 4 },
  { id: "e206", date: "2026-09-28", title: "디자인 시스템 회의", color: "blue", chip: "line", startTime: "17:00", endTime: "17:30", location: "Zoom" },
  { id: "e207", date: "2026-09-30", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e208", date: "2026-09-30", title: "벤치마킹 세션 · 프로젝트 Canvas", color: "purple", chip: "line", startTime: "11:30", endTime: "12:30", location: "라운지", attendeeCount: 3 },
  { id: "e209", date: "2026-09-30", title: "아이콘 디자인 작업", color: "pink", chip: "line", startTime: "14:30", endTime: "15:00", location: "Google Meet" },

  // ── 2026년 10월 ──────────────────────────────────────
  { id: "e210", date: "2026-10-01", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e211", date: "2026-10-03", title: "랜딩페이지 디자인", color: "pink", chip: "line", startTime: "15:30", endTime: "16:00", location: "디자인룸" },
  { id: "e212", date: "2026-10-03", title: "디자인 시스템 작업 · 프로젝트 Atlas", color: "red", chip: "line", startTime: "16:30", endTime: "17:00", location: "Zoom" },
  { id: "e213", date: "2026-10-05", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e214", date: "2026-10-05", title: "디자인 QA 점검 · 프로젝트 Pulse", color: "teal", chip: "line", startTime: "10:30", endTime: "11:30", location: "Zoom", attendeeCount: 4 },
  { id: "e215", date: "2026-10-05", title: "Lottie 애니메이션 검토 · 프로젝트 Nova", color: "blue", chip: "line", startTime: "13:30", endTime: "15:00", location: "Google Meet", attendeeCount: 4 },
  { id: "e216", date: "2026-10-10", title: "벤치마킹 세션", color: "purple", chip: "line", startTime: "15:00", endTime: "15:30", location: "Focus Room 2" },
  { id: "e217", date: "2026-10-10", title: "랜딩페이지 디자인", color: "pink", chip: "line", startTime: "15:30", endTime: "17:00", location: "프로젝트룸", attendeeCount: 6 },
  { id: "e218", date: "2026-10-12", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e219", date: "2026-10-12", title: "주간 디자인 미팅", color: "red", chip: "line", startTime: "10:30", endTime: "11:00", location: "미팅룸 A" },
  { id: "e220", date: "2026-10-12", title: "신입 디자이너 온보딩", color: "red", chip: "line", startTime: "11:00", endTime: "11:30", location: "Zoom" },
  { id: "e221", date: "2026-10-12", title: "스프린트 회고 · 프로젝트 Nova", color: "purple", chip: "line", startTime: "16:30", endTime: "18:00", location: "Design Studio", attendeeCount: 8 },
  { id: "e222", date: "2026-10-12", title: "UX 플로우 검토", color: "blue", chip: "line", startTime: "17:00", endTime: "17:30", location: "Design Studio" },
  { id: "e223", date: "2026-10-13", title: "1:1 미팅", color: "blue", chip: "line", startTime: "10:30", endTime: "12:00", location: "미팅룸 A", attendeeCount: 3 },
  { id: "e224", date: "2026-10-14", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e225", date: "2026-10-14", title: "와이어프레임 리뷰", color: "pink", chip: "line", startTime: "16:00", endTime: "16:30", location: "Google Meet" },
  { id: "e226", date: "2026-10-14", title: "최종 시안 승인", color: "blue", chip: "line", startTime: "16:00", endTime: "16:30", location: "Focus Room 1" },
  { id: "e227", date: "2026-10-14", title: "리서치 결과 공유", color: "purple", chip: "line", startTime: "16:30", endTime: "18:00", location: "프로젝트룸", attendeeCount: 4 },
  { id: "e228", date: "2026-10-19", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e229", date: "2026-10-19", title: "디자인 시스템 회의", color: "red", chip: "line", startTime: "11:30", endTime: "12:30", location: "프로젝트룸", attendeeCount: 7 },
  { id: "e230", date: "2026-10-19", title: "프로젝트 킥오프 · 프로젝트 Pulse", color: "purple", chip: "line", startTime: "13:00", endTime: "14:00", location: "디자인룸", attendeeCount: 7 },
  { id: "e231", date: "2026-10-23", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e232", date: "2026-10-23", title: "디자인 QA", color: "pink", chip: "line", startTime: "10:00", endTime: "10:30", location: "디자인룸" },
  { id: "e233", date: "2026-10-23", title: "유저 인터뷰 · 프로젝트 Canvas", color: "blue", chip: "line", startTime: "15:30", endTime: "17:00", location: "미팅룸 B", attendeeCount: 3 },
  { id: "e234", date: "2026-10-27", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e235", date: "2026-10-27", title: "일러스트 검토", color: "red", chip: "line", startTime: "13:30", endTime: "15:00", location: "미팅룸 A", attendeeCount: 4 },
  { id: "e236", date: "2026-10-27", title: "PM 요구사항 미팅", color: "pink", chip: "line", startTime: "15:30", endTime: "16:30", location: "Google Meet", attendeeCount: 8 },
  { id: "e237", date: "2026-10-27", title: "개발팀 싱크 · 프로젝트 Pulse", color: "pink", chip: "line", startTime: "17:00", endTime: "18:30", location: "Zoom", attendeeCount: 6 },
  { id: "e238", date: "2026-10-30", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e239", date: "2026-10-30", title: "디자인 QA · 프로젝트 Orion", color: "teal", chip: "line", startTime: "10:00", endTime: "11:30", location: "미팅룸 B", attendeeCount: 8 },
  { id: "e240", date: "2026-10-30", title: "최종 시안 승인 · 프로젝트 Lime", color: "purple", chip: "line", startTime: "17:30", endTime: "19:00", location: "Focus Room 1", attendeeCount: 4 },

  // ── 2026년 11월 ──────────────────────────────────────
  { id: "e241", date: "2026-11-01", title: "Figma Variables 워크숍", color: "blue", chip: "filled", location: "프로젝트룸" },
  { id: "e242", date: "2026-11-03", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e243", date: "2026-11-03", title: "사용성 테스트 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "11:00", endTime: "12:30", location: "프로젝트룸", attendeeCount: 6 },
  { id: "e244", date: "2026-11-05", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e245", date: "2026-11-05", title: "주간 디자인 미팅", color: "blue", chip: "line", startTime: "13:00", endTime: "14:00", location: "Focus Room 1", attendeeCount: 4 },
  { id: "e246", date: "2026-11-05", title: "컬러 시스템 리뷰", color: "purple", chip: "line", startTime: "13:00", endTime: "14:30", location: "Focus Room 1", attendeeCount: 5 },
  { id: "e247", date: "2026-11-10", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e248", date: "2026-11-10", title: "팀 점심", color: "red", chip: "line", startTime: "11:30", endTime: "12:30", location: "Design Studio", attendeeCount: 8 },
  { id: "e249", date: "2026-11-11", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e250", date: "2026-11-11", title: "마케팅 배너 검토 · 프로젝트 Canvas", color: "blue", chip: "line", startTime: "10:00", endTime: "10:30", location: "Design Studio" },
  { id: "e251", date: "2026-11-11", title: "유저 인터뷰 · 프로젝트 Atlas", color: "red", chip: "line", startTime: "13:00", endTime: "14:30", location: "미팅룸 B", attendeeCount: 8 },
  { id: "e252", date: "2026-11-11", title: "디자인 리드 리뷰", color: "purple", chip: "line", startTime: "16:30", endTime: "17:30", location: "디자인룸", attendeeCount: 5 },
  { id: "e253", date: "2026-11-11", title: "피그마 라이브 작업 · 프로젝트 Atlas", color: "pink", chip: "line", startTime: "17:00", endTime: "17:30", location: "미팅룸 A" },
  { id: "e254", date: "2026-11-13", title: "디자인 리드 리뷰", color: "red", chip: "line", startTime: "11:00", endTime: "12:30", location: "미팅룸 B", attendeeCount: 7 },
  { id: "e255", date: "2026-11-13", title: "디자인 시스템 회의", color: "purple", chip: "line", startTime: "11:30", endTime: "12:00", location: "라운지" },
  { id: "e256", date: "2026-11-13", title: "디자인팀 데일리 스탠드업 · 프로젝트 Nova", color: "red", chip: "line", startTime: "17:00", endTime: "17:30", location: "Design Studio" },
  { id: "e257", date: "2026-11-13", title: "접근성 리뷰", color: "blue", chip: "line", startTime: "17:00", endTime: "18:00", location: "Focus Room 1", attendeeCount: 7 },
  { id: "e258", date: "2026-11-14", title: "벤치마킹 세션 · 프로젝트 Atlas", color: "blue", chip: "line", startTime: "17:30", endTime: "19:00", location: "미팅룸 A", attendeeCount: 4 },
  { id: "e259", date: "2026-11-19", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e260", date: "2026-11-19", title: "스프린트 회고", color: "purple", chip: "line", startTime: "17:00", endTime: "18:30", location: "Zoom", attendeeCount: 5 },
  { id: "e261", date: "2026-11-23", title: "개발팀 싱크 · 프로젝트 Lime", color: "red", chip: "line", startTime: "10:30", endTime: "12:00", location: "미팅룸 A", attendeeCount: 5 },
  { id: "e262", date: "2026-11-23", title: "개발 핸드오프 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "14:30", endTime: "16:00", location: "디자인룸", attendeeCount: 7 },
  { id: "e263", date: "2026-11-23", title: "최종 시안 승인 · 프로젝트 Atlas", color: "pink", chip: "line", startTime: "17:30", endTime: "18:30", location: "Focus Room 1", attendeeCount: 4 },
  { id: "e264", date: "2026-11-27", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e265", date: "2026-11-27", title: "주간 디자인 미팅", color: "purple", chip: "line", startTime: "13:30", endTime: "14:00", location: "라운지" },
  { id: "e266", date: "2026-11-27", title: "디자인 QA · 프로젝트 Nova", color: "teal", chip: "line", startTime: "14:30", endTime: "15:00", location: "Google Meet" },
  { id: "e267", date: "2026-11-27", title: "랜딩페이지 디자인 · 프로젝트 Pulse", color: "blue", chip: "line", startTime: "14:30", endTime: "16:00", location: "라운지", attendeeCount: 3 },
  { id: "e268", date: "2026-11-30", title: "Figma Variables 워크숍", color: "purple", chip: "filled", location: "라운지" },
  { id: "e269", date: "2026-11-30", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e270", date: "2026-11-30", title: "스프린트 회고 · 프로젝트 Pulse", color: "pink", chip: "line", startTime: "16:00", endTime: "17:00", location: "Design Studio", attendeeCount: 4 },

  // ── 2026년 12월 ──────────────────────────────────────
  { id: "e271", date: "2026-12-01", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e272", date: "2026-12-01", title: "월간 디자인 리뷰", color: "purple", chip: "line", startTime: "14:30", endTime: "16:00", location: "Google Meet", attendeeCount: 7 },
  { id: "e273", date: "2026-12-01", title: "주간 디자인 미팅 · 프로젝트 Canvas", color: "red", chip: "line", startTime: "15:00", endTime: "15:30", location: "미팅룸 B" },
  { id: "e274", date: "2026-12-03", title: "디자인팀 데일리 스탠드업", color: "red", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e275", date: "2026-12-03", title: "디자인 QA 점검", color: "blue", chip: "line", startTime: "17:00", endTime: "17:30", location: "Google Meet" },
  { id: "e276", date: "2026-12-05", title: "Figma Variables 워크숍", color: "red", chip: "filled", location: "Focus Room 1" },
  { id: "e277", date: "2026-12-10", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e278", date: "2026-12-10", title: "1:1 미팅", color: "pink", chip: "line", startTime: "17:30", endTime: "18:00", location: "Design Studio" },
  { id: "e279", date: "2026-12-11", title: "사내 디자인 세미나", color: "purple", chip: "filled", location: "Design Studio" },
  { id: "e280", date: "2026-12-11", title: "디자인팀 데일리 스탠드업", color: "blue", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e281", date: "2026-12-11", title: "UX Writing 검토", color: "blue", chip: "line", startTime: "15:00", endTime: "16:00", location: "Google Meet", attendeeCount: 8 },
  { id: "e282", date: "2026-12-11", title: "스프린트 플래닝", color: "red", chip: "line", startTime: "15:30", endTime: "16:00", location: "미팅룸 B" },
  { id: "e283", date: "2026-12-11", title: "접근성 리뷰", color: "red", chip: "line", startTime: "15:30", endTime: "16:00", location: "Design Studio" },
  { id: "e284", date: "2026-12-13", title: "AI 디자인 툴 스터디 · 프로젝트 Nova", color: "blue", chip: "filled", location: "Zoom" },
  { id: "e285", date: "2026-12-14", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e286", date: "2026-12-14", title: "프로젝트 킥오프", color: "pink", chip: "line", startTime: "15:00", endTime: "15:30", location: "미팅룸 A" },
  { id: "e287", date: "2026-12-14", title: "Lottie 애니메이션 검토 · 프로젝트 Nova", color: "red", chip: "line", startTime: "16:00", endTime: "16:30", location: "Focus Room 1" },
  { id: "e288", date: "2026-12-14", title: "접근성 리뷰", color: "purple", chip: "line", startTime: "17:00", endTime: "18:00", location: "Google Meet", attendeeCount: 8 },
  { id: "e289", date: "2026-12-18", title: "디자인팀 데일리 스탠드업", color: "pink", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e290", date: "2026-12-18", title: "디자인 QA", color: "red", chip: "line", startTime: "16:30", endTime: "17:00", location: "디자인룸" },
  { id: "e291", date: "2026-12-23", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e292", date: "2026-12-23", title: "개발 핸드오프 · 프로젝트 Canvas", color: "blue", chip: "line", startTime: "11:00", endTime: "12:00", location: "프로젝트룸", attendeeCount: 3 },
  { id: "e293", date: "2026-12-23", title: "UX 플로우 검토", color: "teal", chip: "line", startTime: "17:30", endTime: "18:30", location: "프로젝트룸", attendeeCount: 4 },
  { id: "e294", date: "2026-12-28", title: "마케팅 배너 검토 · 프로젝트 Lime", color: "blue", chip: "line", startTime: "10:30", endTime: "11:00", location: "프로젝트룸" },
  { id: "e295", date: "2026-12-28", title: "프로젝트 킥오프 · 프로젝트 Nova", color: "pink", chip: "line", startTime: "15:00", endTime: "16:00", location: "Design Studio", attendeeCount: 5 },
  { id: "e296", date: "2026-12-28", title: "디자인팀 데일리 스탠드업 · 프로젝트 Lime", color: "purple", chip: "line", startTime: "15:30", endTime: "17:00", location: "Focus Room 2" },
  { id: "e297", date: "2026-12-28", title: "브랜드 디자인 리뷰", color: "purple", chip: "line", startTime: "15:30", endTime: "16:30", location: "미팅룸 A", attendeeCount: 3 },
  { id: "e298", date: "2026-12-30", title: "디자인팀 데일리 스탠드업", color: "purple", chip: "line", startTime: "09:30", endTime: "09:45", location: "디자인룸" },
  { id: "e299", date: "2026-12-30", title: "디자인 QA · 프로젝트 Pulse", color: "red", chip: "line", startTime: "14:00", endTime: "15:30", location: "Design Studio", attendeeCount: 8 },
  { id: "e300", date: "2026-12-30", title: "최종 시안 승인", color: "red", chip: "line", startTime: "17:30", endTime: "18:30", location: "Zoom", attendeeCount: 4 },
];

/** 화면을 보는 사람의 역할 — 주최자와 참여자는 서로 다른 캘린더를 본다 */
export type ViewRole = "organizer" | "invitee";

const isWeekendISO = (iso: string) => {
  const day = new Date(iso + "T00:00:00").getDay();
  return day === 0 || day === 6;
};

/** 그 달의 모든 날짜 ISO */
function daysOfMonth(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return Array.from(
    { length: last },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  );
}

/** pool 에서 n개를 고르게 뽑는다 (앞에서부터 균등 간격) */
function pickSpread(pool: string[], n: number): string[] {
  if (n >= pool.length) return pool.slice(0, n);
  const step = pool.length / n;
  return Array.from({ length: n }, (_, i) => pool[Math.floor(i * step)]);
}

/**
 * 참여자용 일정 — 이벤트 내용은 그대로 두고 "일정이 놓이는 날짜" 자체를 바꾼다.
 *
 * 주최자가 쓰지 않은 날 중에서 같은 개수만큼 새로 골라, 그 달의 옛 날짜를
 * 순서대로 새 날짜에 대응시킨다. 두 역할의 날짜 집합이 겹치지 않으므로
 * (예: 주최자 1·2일 → 참여자 3·8일) 모든 일정이 다른 날에 놓인다.
 *
 * 평일은 평일 중에서, 주말은 주말 중에서 고른다. 안 그러면 데일리 스탠드업이
 * 주말로 가거나 주말 워크숍이 평일로 내려온다. 달마다 평일 21~23일 중 8~9일만,
 * 주말 8~10일 중 2~3일만 쓰고 있어 겹치지 않게 새로 뽑을 여유가 충분하다.
 */
function relocateWithinMonth(list: CalendarEvent[]): CalendarEvent[] {
  const byMonth = new Map<string, { weekday: string[]; weekend: string[] }>();
  for (const iso of [...new Set(list.map((e) => e.date))].sort()) {
    const month = iso.slice(0, 7);
    const bucket = byMonth.get(month) ?? { weekday: [], weekend: [] };
    (isWeekendISO(iso) ? bucket.weekend : bucket.weekday).push(iso);
    byMonth.set(month, bucket);
  }

  const moved = new Map<string, string>();
  for (const [month, used] of byMonth) {
    const taken = new Set([...used.weekday, ...used.weekend]);
    const free = daysOfMonth(month).filter((iso) => !taken.has(iso));

    for (const [old, isWeekendBucket] of [
      [used.weekday, false],
      [used.weekend, true],
    ] as const) {
      const pool = free.filter((iso) => isWeekendISO(iso) === isWeekendBucket);
      const picked = pickSpread(pool, old.length);
      old.forEach((iso, i) => moved.set(iso, picked[i]));
    }
  }

  return list.map((e) => ({ ...e, date: moved.get(e.date) ?? e.date }));
}

/**
 * 참여자가 "선택 참여자"로 초대받은 임시(가) 일정.
 * 사이드바 알림을 탭하면 주간 뷰로 전환하며 이 일정이 애니메이션과 함께 임시로 생긴다.
 * 아직 참석을 확정하지 않았으므로 주황 점선 카드(tentative)로 그린다 (Figma 243:9275).
 * 캘린더에 상시로 있지 않고, 탭했을 때만 InviteContext 를 통해 주간 뷰에 합쳐진다.
 */
export const OPTIONAL_MEETING_DATE = "2026-07-15";
export const OPTIONAL_MEETING_EVENT: CalendarEvent = {
  id: "opt-design-meeting",
  date: OPTIONAL_MEETING_DATE,
  title: "디자인팀 회의",
  color: "red",
  chip: "line",
  startTime: "10:00",
  endTime: "10:30",
  location: "UT룸",
  tentative: true,
};

const inviteeEvents = relocateWithinMonth(events);

/** 역할별 일정 목록 */
export function eventsFor(role: ViewRole): CalendarEvent[] {
  return role === "invitee" ? inviteeEvents : events;
}

/** 특정 날짜의 이벤트 목록 */
export function eventsByDate(date: string, role: ViewRole = "organizer"): CalendarEvent[] {
  return eventsFor(role).filter((e) => e.date === date);
}

/** 우측 아젠다에 노출할 날짜들 (오늘, 내일) */
export const AGENDA_DATES = [TODAY, addDays(TODAY, 1)] as const;
