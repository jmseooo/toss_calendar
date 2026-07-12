"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TODAY, toISODate } from "@/lib/calendar";

/**
 * "오늘" 날짜(ISO)를 공유하는 컨텍스트.
 *
 * 첫 렌더는 고정값(TODAY)으로 서버·클라이언트가 똑같이 그려 하이드레이션을 맞추고,
 * 마운트 직후 useEffect에서 실제 오늘(new Date())로 교체한다. 갱신이 하이드레이션
 * 이후 클라이언트에서만 일어나므로 서버 HTML과 어긋나지 않는다.
 */
const TodayContext = createContext<string>(TODAY);

export function TodayProvider({ children }: { children: ReactNode }) {
  const [today, setToday] = useState<string>(TODAY);

  useEffect(() => {
    // 마운트 후 클라이언트 시계를 읽어 실제 오늘로 바꾼다. 하이드레이션을 맞추기 위해
    // 첫 렌더는 고정값으로 두고 여기서만 갱신하는 게 이 패턴의 핵심이라 규칙을 끈다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(toISODate(new Date()));
  }, []);

  return <TodayContext.Provider value={today}>{children}</TodayContext.Provider>;
}

/** 실제 오늘 ISO 날짜. 마운트 전에는 고정 기준일(TODAY)을 반환한다. */
export function useToday(): string {
  return useContext(TodayContext);
}
