"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { OPTIONAL_MEETING_EVENT, type CalendarEvent } from "@/data/events";

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

/** 확정된 회의 — "선택 참여자 초대" 알림·화면에 쓰인다 */
export interface ConfirmedMeeting {
  id: string;
  topic: string;
  /** "07.02 (목)" */
  dateLabel: string;
  /** "10:00~11:00" */
  time: string;
  /** 필수 참석자 이름 목록 */
  participants: string[];
}

/**
 * 회의 한 건의 생애주기. 초대 → 답변 → 확정 → 선택참여자 초대 순으로 필드가 채워진다.
 * 목록(meetings)에서 사라지지 않으므로, 각 단계의 알림이 새로고침 전까지 계속 쌓인다.
 */
export interface Meeting {
  id: string;
  info: InviteInfo;
  /** 참여자 답변 (없으면 아직 미답변) */
  reply: ReplySelection | null;
  /** 확정 시간 "10:00~11:00" (없으면 미확정) */
  confirmedTime: string | null;
  /** 선택 참여자 초대까지 마쳤는지 */
  optionalSent: boolean;
  /** 각 단계 발생 시각 — 알림을 최신순으로 정렬하는 데 쓴다 */
  createdAt: number;
  repliedAt: number | null;
  confirmedAt: number | null;
}

interface InviteContextValue {
  /** 초대된 회의들 — 단계와 무관하게 계속 남는다 */
  meetings: Meeting[];
  sendInvite: (info: InviteInfo) => void;
  submitReply: (id: string, hours: number[], liked: number[]) => void;
  confirmMeeting: (id: string, event: CalendarEvent, time: string) => void;
  markOptionalSent: (id: string) => void;
  /** 주최자가 확정해 캘린더에 올린 회의들 */
  confirmedEvents: CalendarEvent[];
  /** 방금 확정한 이벤트 id — 캘린더에서 펼침 애니메이션 대상 */
  lastConfirmedId: string | null;
  /** 선택 참여자 초대 알림을 탭했을 때 임시로 생기는 가(假) 일정 (없으면 미표시) */
  optionalMeeting: CalendarEvent | null;
  /** 그 임시 일정을 주간 뷰에 드러낸다 (펼침 애니메이션과 함께) */
  revealOptionalMeeting: () => void;
  role: ViewRole;
  toggleRole: () => void;
}

const InviteContext = createContext<InviteContextValue | null>(null);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [confirmedEvents, setConfirmedEvents] = useState<CalendarEvent[]>([]);
  const [lastConfirmedId, setLastConfirmedId] = useState<string | null>(null);
  const [optionalRevealed, setOptionalRevealed] = useState(false);
  const [role, setRole] = useState<ViewRole>("organizer");

  const revealOptionalMeeting = useCallback(() => {
    setOptionalRevealed(true);
    // 방금 생긴 임시 일정으로 지정 → 주간 뷰에서 펼침 애니메이션이 돈다.
    setLastConfirmedId(OPTIONAL_MEETING_EVENT.id);
  }, []);

  const sendInvite = useCallback((info: InviteInfo) => {
    setMeetings((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${prev.length}`,
        info,
        reply: null,
        confirmedTime: null,
        optionalSent: false,
        createdAt: Date.now(),
        repliedAt: null,
        confirmedAt: null,
      },
    ]);
  }, []);
  const submitReply = useCallback(
    (id: string, hours: number[], liked: number[]) => {
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, reply: { hours, liked }, repliedAt: Date.now() }
            : m,
        ),
      );
    },
    [],
  );
  const confirmMeeting = useCallback(
    (id: string, event: CalendarEvent, time: string) => {
      setConfirmedEvents((prev) => [...prev, event]);
      setLastConfirmedId(event.id);
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, confirmedTime: time, confirmedAt: Date.now() }
            : m,
        ),
      );
    },
    [],
  );
  const markOptionalSent = useCallback((id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, optionalSent: true } : m)),
    );
  }, []);
  const toggleRole = useCallback(
    () => setRole((r) => (r === "organizer" ? "invitee" : "organizer")),
    [],
  );

  const value = useMemo(
    () => ({
      meetings,
      sendInvite,
      submitReply,
      confirmMeeting,
      markOptionalSent,
      confirmedEvents,
      lastConfirmedId,
      optionalMeeting: optionalRevealed ? OPTIONAL_MEETING_EVENT : null,
      revealOptionalMeeting,
      role,
      toggleRole,
    }),
    [
      meetings,
      sendInvite,
      submitReply,
      confirmMeeting,
      markOptionalSent,
      confirmedEvents,
      lastConfirmedId,
      optionalRevealed,
      revealOptionalMeeting,
      role,
      toggleRole,
    ],
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
