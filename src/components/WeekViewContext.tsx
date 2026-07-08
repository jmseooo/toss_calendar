"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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

  return (
    <WeekViewContext.Provider
      value={{
        anchor,
        goPrev: () => setAnchor((a) => addDays(a, -7)),
        goNext: () => setAnchor((a) => addDays(a, 7)),
        goToday: () => setAnchor(TODAY),
      }}
    >
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
