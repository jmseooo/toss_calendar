/**
 * 캘린더 날짜 계산 유틸.
 * "기준 월"과 "오늘"은 실제 현재 날짜(new Date)를 기준으로 동적으로 계산됩니다.
 */

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** Date → "YYYY-MM-DD" (로컬 시간 기준, 타임존 밀림 방지) */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 데모의 기준 "오늘" — 고정 값이다.
 *
 * new Date()로 실시간 계산하면 안 된다. 이 앱은 SSR(Next)인데, 서버 프로세스가
 * 뜬 시각과 브라우저가 로드한 시각이 자정을 사이에 두면 서버 HTML과 클라이언트
 * 첫 렌더의 날짜가 어긋나 하이드레이션이 깨진다(서버/클라 타임존이 달라도 마찬가지).
 * 게다가 일정 데이터가 2026년으로 고정돼 있어, 실시간 오늘은 곧 시드 밖으로 벗어난다.
 *
 * 그래서 시안 배치(7/10=오늘 5건, 7/11=내일 3건)에 맞춰 2026-07-10으로 고정한다.
 */
const REFERENCE = new Date(2026, 6, 10); // 월은 0부터 → 6 = 7월

/** 화면에 표시할 기준 연·월 */
export const VIEW_YEAR = REFERENCE.getFullYear();
export const VIEW_MONTH = REFERENCE.getMonth() + 1; // 1부터 시작
/** 기준 "오늘" 날짜 */
export const TODAY = toISODate(REFERENCE);

export interface DayCell {
  /** ISO 날짜 문자열 (YYYY-MM-DD) */
  date: string;
  /** 해당 월의 일(day) */
  day: number;
  /** 현재 보고 있는 월에 속하는지 여부 */
  inMonth: boolean;
  /** 오늘인지 여부 */
  isToday: boolean;
  /** 요일 (0=일 ~ 6=토) */
  weekday: number;
}

/**
 * 6주(42칸) 월간 그리드를 생성한다. 일요일 시작.
 * @param year 연도
 * @param month1 월 (1부터 시작)
 * @param today 오늘 날짜 ISO 문자열
 */
export function buildMonthGrid(
  year: number,
  month1: number,
  today: string,
): DayCell[] {
  const month0 = month1 - 1;
  const firstOfMonth = new Date(year, month0, 1);
  const startOffset = firstOfMonth.getDay(); // 0=일요일
  const gridStart = new Date(year, month0, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = toISODate(d);
    return {
      date: iso,
      day: d.getDate(),
      inMonth: d.getMonth() === month0,
      isToday: iso === today,
      weekday: d.getDay(),
    };
  });
}

/**
 * 특정 날짜가 속한 주(일요일 시작, 7칸) 그리드를 생성한다.
 * @param refISO 기준 날짜 ISO (이 날짜가 포함된 주를 만든다)
 * @param today 오늘 날짜 ISO 문자열
 */
export function buildWeekGrid(refISO: string, today: string): DayCell[] {
  const ref = new Date(refISO + "T00:00:00");
  const weekStart = new Date(ref);
  weekStart.setDate(ref.getDate() - ref.getDay()); // 그 주의 일요일

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = toISODate(d);
    return {
      date: iso,
      day: d.getDate(),
      inMonth: true,
      isToday: iso === today,
      weekday: d.getDay(),
    };
  });
}

/** ISO 날짜에 일수를 더한다 */
export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** ISO 날짜의 연도와 월(1부터 시작)을 반환한다 */
export function yearMonthOf(iso: string): { year: number; month: number } {
  const d = new Date(iso + "T00:00:00");
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

/** VIEW 월의 특정 일(day) → ISO 날짜 */
export function dayOfViewMonth(day: number): string {
  return toISODate(new Date(VIEW_YEAR, VIEW_MONTH - 1, day));
}

/** "2026-07-02" → "2일 (목)" 형태의 라벨 */
export function formatAgendaHeading(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return `${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}
