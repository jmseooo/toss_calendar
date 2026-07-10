"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** 전송된 회의 초대 정보 — 알림 표시에 그대로 쓰이도록 표시용 문자열로 담는다. */
export interface InviteInfo {
  /** 회의 주제 */
  topic: string;
  /** 답장(초대)한 필수 참석자 이름 목록 */
  participants: string[];
  /** 회의 날짜 ISO "YYYY-MM-DD" — 확정 화면에서 시간대를 다시 계산하는 데 쓴다 */
  startDate: string;
  /** "07.09 (목)" 형태의 날짜 라벨 */
  dateLabel: string;
  /** 가장 많이 겹친 추천 시간 "11:00~12:00" */
  recommendedTime: string;
}

interface InviteContextValue {
  /** 아직 초대를 안 보냈으면 null */
  invite: InviteInfo | null;
  sendInvite: (info: InviteInfo) => void;
  clearInvite: () => void;
}

const InviteContext = createContext<InviteContextValue | null>(null);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  return (
    <InviteContext.Provider
      value={{ invite, sendInvite: setInvite, clearInvite: () => setInvite(null) }}
    >
      {children}
    </InviteContext.Provider>
  );
}

export function useInvite() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used within InviteProvider");
  return ctx;
}
