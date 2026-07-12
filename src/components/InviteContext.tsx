"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

/**
 * 화면을 보는 사람의 역할.
 * organizer = 회의를 만든 주최자, invitee = 초대받은 참여자.
 * UI는 같고 사이드바 알림 내용만 달라진다.
 */
export type ViewRole = "organizer" | "invitee";

/** 참여자가 답변 화면에서 고른 결과 — 선택한 시간대와 "좋아요"한 시간대(시각 hour) */
export interface ReplySelection {
  hours: number[];
  liked: number[];
}

interface InviteContextValue {
  /** 아직 초대를 안 보냈으면 null */
  invite: InviteInfo | null;
  sendInvite: (info: InviteInfo) => void;
  clearInvite: () => void;
  /** 참여자가 보낸 답변 — 아직 안 보냈으면 null. 주최자의 "일정 확정" 알림은 이때부터 뜬다 */
  reply: ReplySelection | null;
  submitReply: (hours: number[], liked: number[]) => void;
  role: ViewRole;
  toggleRole: () => void;
}

const InviteContext = createContext<InviteContextValue | null>(null);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [reply, setReply] = useState<ReplySelection | null>(null);
  const [role, setRole] = useState<ViewRole>("organizer");

  // 새 초대를 보내면 답변을 초기화한다.
  const sendInvite = useCallback((info: InviteInfo) => {
    setInvite(info);
    setReply(null);
  }, []);
  const clearInvite = useCallback(() => {
    setInvite(null);
    setReply(null);
  }, []);
  const submitReply = useCallback(
    (hours: number[], liked: number[]) => setReply({ hours, liked }),
    [],
  );
  const toggleRole = useCallback(
    () => setRole((r) => (r === "organizer" ? "invitee" : "organizer")),
    [],
  );

  const value = useMemo(
    () => ({ invite, sendInvite, clearInvite, reply, submitReply, role, toggleRole }),
    [invite, sendInvite, clearInvite, reply, submitReply, role, toggleRole],
  );

  return (
    <InviteContext.Provider value={value}>{children}</InviteContext.Provider>
  );
}

export function useInvite() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used within InviteProvider");
  return ctx;
}
