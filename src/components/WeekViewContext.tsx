"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TODAY, addDays } from "@/lib/calendar";

/**
 * 주간 뷰에서 표시 중인 "주"를 공유하는 컨텍스트.
 * 툴바의 이전/다음 화살표가 이 값을 바꾸면 주간 그리드가 함께 갱신됩니다.
 * (월간의 MonthViewContext 와 같은 역할을 주 단위로 한다)
 */
interface WeekViewContextValue {
  /** 표시 중인 주에 속한 기준 날짜 (ISO) */
  anchor: string;
  /** 이전 주로 이동 */
  goPrev: () => void;
  /** 다음 주로 이동 */
  goNext: () => void;
  /** 오늘이 속한 주로 이동 */
  goToday: () => void;
}

const WeekViewContext = createContext<WeekViewContextValue | null>(null);

export function WeekViewProvider({ children }: { children: ReactNode }) {
  // 처음엔 실제 오늘이 속한 주를 보여준다.
  const [anchor, setAnchor] = useState<string>(TODAY);

  // 참조가 안정적이어야 한다. 주간 그리드의 휠 핸들러(useWheelPaging)가 이 함수들을
  // 의존성으로 재등록되는데, 매 렌더 새 함수면 휠 누적량과 쿨다운이 초기화된다.
  const goPrev = useCallback(() => setAnchor((a) => addDays(a, -7)), []);
  const goNext = useCallback(() => setAnchor((a) => addDays(a, 7)), []);
  const goToday = useCallback(() => setAnchor(TODAY), []);

  const value = useMemo(
    () => ({ anchor, goPrev, goNext, goToday }),
    [anchor, goPrev, goNext, goToday],
  );

  return (
    <WeekViewContext.Provider value={value}>
      {children}
    </WeekViewContext.Provider>
  );
}

export function useWeekView(): WeekViewContextValue {
  const ctx = useContext(WeekViewContext);
  if (!ctx) {
    throw new Error("useWeekView must be used within a WeekViewProvider");
  }
  return ctx;
}
