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
import { useToday } from "./TodayContext";

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
  /** 특정 날짜가 속한 주로 이동 */
  goToDate: (iso: string) => void;
}

const WeekViewContext = createContext<WeekViewContextValue | null>(null);

export function WeekViewProvider({ children }: { children: ReactNode }) {
  const today = useToday();
  // 첫 렌더는 고정 기준일(SSR 안전)로, 마운트 뒤 실제 오늘이 속한 주로 맞춘다.
  const [anchor, setAnchor] = useState<string>(TODAY);

  // today가 실제 오늘로 바뀌면 그 날짜로 앵커를 옮긴다.
  // 이펙트가 아니라 이전 값과 비교해 렌더 중에 조정한다(React 권장 패턴).
  const [prevToday, setPrevToday] = useState(today);
  if (prevToday !== today) {
    setPrevToday(today);
    setAnchor(today);
  }

  // 참조가 안정적이어야 한다. 주간 그리드의 휠 핸들러(useWheelPaging)가 이 함수들을
  // 의존성으로 재등록되는데, 매 렌더 새 함수면 휠 누적량과 쿨다운이 초기화된다.
  const goPrev = useCallback(() => setAnchor((a) => addDays(a, -7)), []);
  const goNext = useCallback(() => setAnchor((a) => addDays(a, 7)), []);
  const goToday = useCallback(() => setAnchor(today), [today]);
  const goToDate = useCallback((iso: string) => setAnchor(iso), []);

  const value = useMemo(
    () => ({ anchor, goPrev, goNext, goToday, goToDate }),
    [anchor, goPrev, goNext, goToday, goToDate],
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
