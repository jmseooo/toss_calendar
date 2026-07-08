"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { VIEW_YEAR, VIEW_MONTH } from "@/lib/calendar";

/**
 * 현재 화면에 표시 중인 "월"을 공유하는 컨텍스트.
 * 툴바의 이전/다음 화살표가 이 값을 바꾸면 월간 그리드가 함께 갱신됩니다.
 */
interface MonthViewContextValue {
  /** 표시 중인 연도 */
  year: number;
  /** 표시 중인 월 (1부터 시작) */
  month: number;
  /** 이전 달로 이동 */
  goPrev: () => void;
  /** 다음 달로 이동 */
  goNext: () => void;
  /** 오늘이 속한 달로 이동 */
  goToday: () => void;
}

const MonthViewContext = createContext<MonthViewContextValue | null>(null);

export function MonthViewProvider({ children }: { children: ReactNode }) {
  // 처음엔 실제 오늘이 속한 달을 보여준다.
  const [cursor, setCursor] = useState({ year: VIEW_YEAR, month: VIEW_MONTH });

  const goPrev = () =>
    setCursor(({ year, month }) =>
      month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 },
    );

  const goNext = () =>
    setCursor(({ year, month }) =>
      month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 },
    );

  const goToday = () => setCursor({ year: VIEW_YEAR, month: VIEW_MONTH });

  return (
    <MonthViewContext.Provider
      value={{ year: cursor.year, month: cursor.month, goPrev, goNext, goToday }}
    >
      {children}
    </MonthViewContext.Provider>
  );
}

export function useMonthView(): MonthViewContextValue {
  const ctx = useContext(MonthViewContext);
  if (!ctx) {
    throw new Error("useMonthView must be used within a MonthViewProvider");
  }
  return ctx;
}
