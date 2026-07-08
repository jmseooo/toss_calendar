"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * 캘린더 표시 모드(월간/주간)를 공유하는 컨텍스트.
 * 툴바의 뷰 토글이 이 값을 바꾸면 가운데 캘린더가 월간/주간으로 전환됩니다.
 */
export type CalendarViewMode = "month" | "week";

interface ViewModeContextValue {
  /** 현재 표시 모드 */
  mode: CalendarViewMode;
  /** 표시 모드 변경 */
  setMode: (mode: CalendarViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CalendarViewMode>("month");

  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextValue {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return ctx;
}
