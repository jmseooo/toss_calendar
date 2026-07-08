/**
 * 참석자별 "바쁜 시간(일정)" 데이터 생성기.
 *
 * "필수 참석자 일정 찾기" 화면에서, 선택한 참석자들의 실제 일정을 바탕으로
 * 특정 날짜의 시간대별 가능/불가능을 계산하는 데 쓰입니다.
 *
 * ⚠️ 목업 데이터지만, 원본 파이썬 스크립트(users_calendar.json 생성기)의 핵심 구조를
 * 그대로 옮겼습니다:
 *   - "허브(hub)" = 다수가 함께 참여하는 요일 반복 그룹 일정 9개
 *   - 각 사람은 이 9개 중 6개에 소속 → 두 사람은 항상 최소 3개 허브가 겹침
 *   - 여기에 개인 랜덤 일정(1~3개/일)이 더해짐
 *
 * events.ts 와 마찬가지로 "실제 날짜"를 입력받아 그 날짜 기준으로 동적 계산하며,
 * (이름, 날짜)를 시드로 쓰는 결정론적 난수라 언제 실행해도 같은 사람은 같은 일정을
 * 가집니다. 나중에 실제 API/DB를 붙일 때는 busyHoursFor()만 교체하면 됩니다.
 */

/** 업무 시간: 09:00 시작 슬롯 ~ 20:00 시작 슬롯 (각 1시간) */
export const DAY_START_HOUR = 9;
export const DAY_END_HOUR = 21; // 마지막 슬롯 시작은 20시 (20:00~21:00)

/** 요일 반복 그룹 일정(허브) — weekday: 0=일 ~ 6=토 */
const HUBS: { title: string; weekday: number; hour: number }[] = [
  { title: "팀 정기 회의", weekday: 1, hour: 9 },
  { title: "스터디 모임", weekday: 2, hour: 19 },
  { title: "운동 클래스", weekday: 3, hour: 12 },
  { title: "동아리 모임", weekday: 4, hour: 18 },
  { title: "북클럽", weekday: 5, hour: 20 },
  { title: "요가 수업", weekday: 6, hour: 10 },
  { title: "네트워킹 모임", weekday: 2, hour: 13 },
  { title: "세미나", weekday: 4, hour: 10 },
  { title: "봉사 활동", weekday: 6, hour: 14 },
];
const HUB_PICK = 6; // 9개 중 6개 소속 → 두 사람 최소 2*6-9=3개 겹침 보장

/** 개인 일정 제목 풀 */
const PERSONAL_TITLES = [
  "병원 예약", "미용실", "친구 약속", "가족 식사", "카페 작업", "헬스장",
  "영화 관람", "장보기", "은행 업무", "치과", "프로젝트 작업", "산책",
  "온라인 강의", "멘토링", "사이드 프로젝트", "독서", "요리", "청소",
  "드라이브", "전시회 관람",
];

/* ── 결정론적 난수 (FNV-1a 해시 + mulberry32) ──────────────────── */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 사람별 소속 허브 인덱스 6개 (이름 시드 기반, 항상 동일) */
function hubMembership(name: string): number[] {
  const rnd = mulberry32(hashStr("hub|" + name));
  const idx = HUBS.map((_, i) => i);
  // Fisher-Yates 셔플 후 앞 6개
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, HUB_PICK);
}

/**
 * 특정 사람이 특정 날짜에 바쁜 시간 → 제목 맵.
 * key: 시작 시각(hour), value: 일정 제목.
 */
export function busyHoursFor(name: string, date: string): Map<number, string> {
  const map = new Map<number, string>();
  const weekday = new Date(date + "T00:00:00").getDay();

  // 1) 허브(요일 반복 그룹 일정)
  for (const hi of hubMembership(name)) {
    const hub = HUBS[hi];
    if (hub.weekday === weekday) map.set(hub.hour, hub.title);
  }

  // 2) 개인 랜덤 일정 1~3개
  const rnd = mulberry32(hashStr("day|" + name + "|" + date));
  const count = 1 + Math.floor(rnd() * 3);
  for (let k = 0; k < count; k++) {
    const hour = DAY_START_HOUR + Math.floor(rnd() * (DAY_END_HOUR - DAY_START_HOUR));
    if (!map.has(hour)) {
      map.set(hour, PERSONAL_TITLES[Math.floor(rnd() * PERSONAL_TITLES.length)]);
    }
  }

  return map;
}

/** 시간대 슬롯 — 해당 시각에 바쁜 참석자 목록 포함 */
export interface DaySlot {
  /** 시작 시각(hour) */
  hour: number;
  /** "09:00~10:00" */
  time: string;
  /** 이 시간에 일정이 있는(불가능한) 참석자들 */
  blockedBy: { name: string; title: string }[];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * 선택한 참석자들과 날짜로 하루(09~21시) 시간대별 가능/불가능을 계산한다.
 * blockedBy 가 비어 있으면 "모두 가능", 아니면 "불가능 N명".
 */
export function buildDaySlots(names: string[], date: string): DaySlot[] {
  const per = names.map((name) => ({ name, busy: busyHoursFor(name, date) }));
  const slots: DaySlot[] = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    const blockedBy = per
      .filter((p) => p.busy.has(h))
      .map((p) => ({ name: p.name, title: p.busy.get(h)! }));
    slots.push({ hour: h, time: `${pad(h)}:00~${pad(h + 1)}:00`, blockedBy });
  }
  return slots;
}
