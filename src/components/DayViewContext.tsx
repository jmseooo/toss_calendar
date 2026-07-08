"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * 선택된 "개별 일자"를 공유하는 컨텍스트.
 * 월간 그리드에서 날짜를 클릭하면 여기에 날짜가 담기고,
 * 이 값을 읽는 일별 캘린더(DayView)가 열립니다.
 */
interface DayViewContextValue {
  /** 열려 있는 일별 뷰의 ISO 날짜. 닫혀 있으면 null */
  selectedDate: string | null;
  /** 해당 날짜의 일별 뷰 열기 */
  openDay: (iso: string) => void;
  /** 일별 뷰 닫기 */
  closeDay: () => void;
}

const DayViewContext = createContext<DayViewContextValue | null>(null);

export function DayViewProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <DayViewContext.Provider
      value={{
        selectedDate,
        openDay: setSelectedDate,
        closeDay: () => setSelectedDate(null),
      }}
    >
      {children}
    </DayViewContext.Provider>
  );
}

export function useDayView(): DayViewContextValue {
  const ctx = useContext(DayViewContext);
  if (!ctx) {
    throw new Error("useDayView must be used within a DayViewProvider");
  }
  return ctx;
}
