"use client";

import { Fragment, useState, type ReactNode } from "react";
import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";
import { useInvite } from "./InviteContext";
import { useViewMode } from "./ViewModeContext";
import { useWeekView } from "./WeekViewContext";
import { useNotifPanel } from "./NotifPanelContext";
import { SELF } from "@/data/people";
import { OPTIONAL_MEETING_DATE } from "@/data/events";
import { WEEKDAYS } from "@/lib/calendar";
import MeetingConfirmView from "./MeetingConfirmView";
import MeetingReplyView from "./MeetingReplyView";
import MeetingInviteView from "./MeetingInviteView";
import Avatar from "./Avatar";
import { avatarByIndex } from "@/data/avatars";

/** "2026-07-02" → "7/2 (목)" */
function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
}

/** 09 → "09:00" */
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;

const CARD =
  "transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] flex w-full flex-col gap-[8px] rounded-[22px] px-[14px] py-[18px] text-left hover:bg-gray-100/60";
const DOT = "size-[8px] shrink-0 rounded-full bg-[#ff6a60]";

/**
 * 좌측 사이드바 — 아이콘 열 + 알림 패널.
 * 알림은 회의(meetings) 목록에서 역할별로 파생된다. 회의는 단계가 지나도 목록에서
 * 사라지지 않으므로, 각 단계의 알림이 새로고침 전까지 계속 쌓인다.
 * 처음 뜬 알림엔 빨간 점이 있고, 사용자가 그 알림을 직접 누르면 그 점만 사라진다.
 */
export default function Sidebar() {
  const {
    meetings,
    submitReply,
    confirmMeeting,
    markOptionalSent,
    revealOptionalMeeting,
    acceptOptionalMeeting,
    role,
  } = useInvite();
  const { setMode } = useViewMode();
  const { goToDate } = useWeekView();
  // 알림 패널 열림 상태는 공유한다 — 열리면 우측 일별(아젠다) 캘린더가 접힌다.
  const { open: notifOpen, setOpen: setNotifOpen } = useNotifPanel();
  const [replyMeetingId, setReplyMeetingId] = useState<string | null>(null);
  const [confirmMeetingId, setConfirmMeetingId] = useState<string | null>(null);
  const [inviteMeetingId, setInviteMeetingId] = useState<string | null>(null);

  // 역할을 바꾸면 열려 있던 화면(회의 확정·답변·초대 뷰)을 닫는다.
  // 패널 열기(setNotifOpen)는 다른 컴포넌트 상태라 렌더 중 호출할 수 없어,
  // 역할 토글 버튼(AgendaPanel)의 클릭 핸들러에서 처리한다.
  const [prevRole, setPrevRole] = useState(role);
  if (prevRole !== role) {
    setPrevRole(role);
    setReplyMeetingId(null);
    setConfirmMeetingId(null);
    setInviteMeetingId(null);
  }

  const isInvitee = role === "invitee";

  // 직접 누른 알림만 읽음 처리 (그 알림의 빨간 점만 사라짐, 카드는 유지).
  const [readKeys, setReadKeys] = useState<Set<string>>(() => new Set());
  const markRead = (k: string) =>
    setReadKeys((prev) => (prev.has(k) ? prev : new Set([...prev, k])));
  const isUnread = (k: string) => !readKeys.has(k);
  const dot = (key: string) =>
    isUnread(key) ? <span className={`mt-[2px] ${DOT}`} /> : null;

  // 참여자 뷰에서 함께 받는 "다른 회의의 선택 참여자 초대" 시드 알림.
  // 참석/미참석만 답할 수 있고, 답하면 그 알림만 읽음 처리된다.
  const [optionalAnswer, setOptionalAnswer] = useState<
    "attend" | "decline" | null
  >(null);
  // 카드 자체를 탭하면 선택 상태(그라데이션 배경)로 바뀐다.
  const [optionalSelected, setOptionalSelected] = useState(false);
  // 미참석을 누르면 확인 알럿을 띄운다.
  const [declineAlertOpen, setDeclineAlertOpen] = useState(false);
  // 시드 알림 발생 시각 — 최신순 정렬용. 마운트 시점으로 고정한다.
  const [seedAt] = useState(() => Date.now());

  // 선택 참여자 초대 카드 탭 → 선택 강조 + 주간 뷰로 전환해 '디자인 미팅' 포커싱.
  const openOptional = () => {
    markRead("opt-design-meeting");
    setOptionalSelected(true);
    setMode("week");
    goToDate(OPTIONAL_MEETING_DATE);
    // 주간 뷰로 옮긴 뒤 임시 일정을 얹어야 펼침 애니메이션이 보인다.
    window.setTimeout(() => revealOptionalMeeting(), 280);
  };

  const replyMtg = meetings.find((m) => m.id === replyMeetingId) ?? null;
  const confirmMtg = meetings.find((m) => m.id === confirmMeetingId) ?? null;
  const inviteMtg = meetings.find((m) => m.id === inviteMeetingId) ?? null;

  // ── 알림 카드 구성 — 발생 시각(at)이 늦을수록 위로 온다 ──
  const items: { key: string; at: number; node: ReactNode }[] = [];
  meetings.forEach((m) => {
    const { info } = m;

    if (isInvitee) {
      if (m.reply === null) {
        const key = `inv-${m.id}`;
        items.push({
          key,
          at: m.createdAt,
          node: (
            <button
              type="button"
              onClick={() => {
                markRead(key);
                setReplyMeetingId(m.id);
              }}
              className={CARD}
            >
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-start gap-[6px]">
                  <Avatar src={avatarByIndex(0)} className="size-[24px]" />
                  <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                    참여자
                  </span>
                  {dot(key)}
                </div>
                <p className="pl-[2px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                  ‘{info.topic}’ 회의 일정에 초대했어요.
                </p>
              </div>
              <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                가능 시간을 선택해 답변해주세요.
              </p>
            </button>
          ),
        });
      } else {
        const key = `sel-${m.id}`;
        const at = m.repliedAt ?? m.createdAt;
        const replier =
          info.participants.find((n) => n !== SELF) ??
          info.participants[0] ??
          "참여자";
        items.push({
          key,
          at,
          node: (
            <button
              type="button"
              onClick={() => markRead(key)}
              className={CARD}
            >
              <div className="flex items-start gap-[6px]">
                <Avatar name={replier} className="size-[24px]" />
                <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                  {replier}
                </span>
                {dot(key)}
              </div>
              <p className="pl-[2px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                ‘{info.topic}’ 회의 일정을 선택했습니다.
              </p>
              <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
                {formatShortDate(info.startDate)} {info.recommendedTime}
              </p>
            </button>
          ),
        });
      }
    } else {
      // 주최자
      if (m.reply && !m.confirmedTime) {
        const key = `can-${m.id}`;
        const at = m.repliedAt ?? m.createdAt;
        items.push({
          key,
          at,
          node: (
            <button
              type="button"
              onClick={() => {
                markRead(key);
                setConfirmMeetingId(m.id);
              }}
              className={CARD}
            >
              <div className="flex items-start gap-[8px]">
                <p className="flex-1 text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                  ‘{info.topic}’ 회의 일정을 확정할 수 있어요.
                </p>
                {dot(key)}
              </div>
            </button>
          ),
        });
      }
      if (m.confirmedTime) {
        const key = `notice-${m.id}`;
        const at = m.confirmedAt ?? m.createdAt;
        items.push({
          key,
          at,
          node: (
            <button
              type="button"
              onClick={() => {
                markRead(key);
                setInviteMeetingId(m.id);
              }}
              className={CARD}
            >
              <div className="flex items-start gap-[8px]">
                <p className="flex-1 text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                  ‘{info.topic}’에 선택 참여자를 초대할 수 있어요.
                </p>
                {dot(key)}
              </div>
            </button>
          ),
        });
      }
    }
  });

  // 참여자 뷰에선 다른 회의의 "선택 참여자 초대"도 함께 받는다 (Figma 243:5768).
  // 주최자가 만든 회의 초대와 별개인 시드 알림 — 참석/미참석만 답한다.
  // 발생 시각은 가장 최근 필수 초대 바로 아래에 오도록 맞춘다 (필수 초대와 "동시에" 노출).
  if (isInvitee) {
    const key = "opt-design-meeting";
    const latestInviteAt = meetings.reduce(
      (mx, m) => Math.max(mx, m.createdAt),
      0,
    );
    items.push({
      key,
      at: latestInviteAt > 0 ? latestInviteAt - 1 : seedAt,
      node: (
        <div
          role="button"
          tabIndex={0}
          onClick={openOptional}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openOptional();
            }
          }}
          className={`flex w-full cursor-pointer flex-col gap-[8px] rounded-[18px] px-[14px] py-[18px] text-left transition duration-150 ease-out ${
            optionalSelected ? "" : "hover:bg-gray-100/60"
          }`}
          style={
            optionalSelected
              ? {
                  backgroundImage:
                    "linear-gradient(161.75deg, rgb(255,239,228) 18.345%, rgb(255,238,198) 100.3%)",
                }
              : undefined
          }
        >
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-start gap-[6px]">
              <Avatar src={avatarByIndex(1)} className="size-[24px]" />
              <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                참여자
              </span>
              {dot(key)}
            </div>
            <p className="pl-[2px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
              ‘디자인 미팅’ 회의 일정에 초대했어요.
            </p>
          </div>
          {optionalAnswer === null ? (
            <>
              <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                참석 여부를 선택해 답해주세요.
              </p>
              <div className="flex w-[226px] gap-[10px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeclineAlertOpen(true);
                  }}
                  className={`flex h-[31px] flex-1 items-center justify-center rounded-[8px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black transition duration-150 ease-out hover:brightness-95 active:scale-[0.98] ${
                    optionalSelected ? "bg-white" : "bg-[#f3f4f5]"
                  }`}
                >
                  미참석
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markRead(key);
                    setOptionalAnswer("attend");
                    // 주간 뷰의 임시 일정을 점선 → 진한 채움 카드로 바꾼다.
                    acceptOptionalMeeting();
                  }}
                  className="flex h-[31px] flex-1 items-center justify-center rounded-[8px] bg-carrot-600 text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-white transition duration-150 ease-out hover:brightness-95 active:scale-[0.98]"
                >
                  참석
                </button>
              </div>
            </>
          ) : (
            <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
              {optionalAnswer === "attend"
                ? "‘참석’으로 답했어요."
                : "‘미참석’으로 답했어요."}
            </p>
          )}
        </div>
      ),
    });
  }

  // 발생 시각이 늦은 알림일수록 위로. 같은 시각(한 회의의 답변 도착·확정 가능)은
  // push 순서를 유지하도록 안정 정렬을 쓴다.
  items.sort((a, b) => b.at - a.at);

  const notifCount = items.length;
  const hasNotif = notifCount > 0;
  const anyUnread = items.some((it) => isUnread(it.key));

  return (
    <aside
      className={`flex h-full shrink-0 overflow-hidden border-r border-gray-400/40 bg-gray-00/70 transition-[width] duration-300 ease-out ${
        notifOpen ? "w-[380px]" : "w-[52px] sm:w-[62px] xl:w-[72px]"
      }`}
    >
      {/* 아이콘 열 */}
      <div className="flex w-[52px] shrink-0 flex-col items-center pt-[16px] sm:w-[62px] sm:pt-[20px] xl:w-[72px] xl:pt-[23px]">
        {/* 로고 — width/height는 원본 픽셀(240x240) 그대로. 작게 주면 재인코딩돼 뭉개진다. */}
        <Image
          src="/logo-v2.png"
          alt="로고"
          width={240}
          height={240}
          priority
          unoptimized
          className="size-[32px] sm:size-[40px] xl:size-[48px]"
        />

        {/* 네비게이션 아이콘 */}
        <nav className="mt-[40px] flex flex-col items-center gap-[24px] text-gray-1000 sm:mt-[50px] sm:gap-[30px] xl:mt-[61px] xl:gap-[36px]">
          {/* 알림 */}
          <div className="relative">
            <button
              type="button"
              aria-label="알림"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((v) => !v)}
              className={`transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] block hover:text-carrot-600 ${
                notifOpen ? "text-carrot-600" : ""
              }`}
            >
              <BellIcon />
            </button>
            {/* 새 알림 점 — 안 읽은 알림이 하나라도 있을 때만 */}
            {anyUnread && (
              <span className="pointer-events-none absolute -right-[2px] -top-[1px] size-[9px] rounded-full bg-[#ff6a60] ring-2 ring-gray-00" />
            )}
          </div>

          <button
            type="button"
            aria-label="검색"
            className="transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:text-carrot-600"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="채팅"
            className="transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:text-carrot-600"
          >
            <ChatIcon />
          </button>
        </nav>
      </div>

      {/* 알림 패널 */}
      {notifOpen && (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto pt-[30px] pr-[14px]">
          <p className="pl-[4px] text-[24px] font-semibold leading-[1.4] tracking-[-0.5px] text-gray-1000">
            알림 ({notifCount})
          </p>

          {hasNotif ? (
            <div className="mt-[14px] flex flex-col gap-[2px]">
              {items.map(({ key, node }) => (
                <Fragment key={key}>{node}</Fragment>
              ))}
            </div>
          ) : (
            <p className="mt-[16px] rounded-[18px] bg-gray-100/70 px-[16px] py-[24px] text-center text-[14px] font-medium leading-[1.5] tracking-[-0.5px] text-gray-600">
              새 알림이 없어요
            </p>
          )}
        </div>
      )}

      {/* 회의 일정 확정하기 — 답변 도착/확정 가능 알림에서 연다 */}
      {confirmMtg && (
        <MeetingConfirmView
          key={confirmMtg.id}
          open
          invite={confirmMtg.info}
          selectedHours={confirmMtg.reply?.hours ?? []}
          initialHour={confirmMtg.reply?.liked[0] ?? confirmMtg.reply?.hours[0]}
          onClose={() => setConfirmMeetingId(null)}
          onConfirm={(hour) => {
            const event = {
              id: `confirmed-${confirmMtg.id}`,
              date: confirmMtg.info.startDate,
              title: confirmMtg.info.topic,
              color: "blue" as const,
              chip: "line" as const,
              startTime: hourLabel(hour),
              endTime: hourLabel(hour + 1),
              attendeeCount: confirmMtg.info.participants.length,
            };
            const time = `${hourLabel(hour)}~${hourLabel(hour + 1)}`;
            // 주간 뷰의 그 주로 전환하고 화면을 닫는다.
            goToDate(confirmMtg.info.startDate);
            setMode("week");
            setConfirmMeetingId(null);
            setNotifOpen(false);
            // 뷰 전환 뒤 블록을 얹어야 펼침 애니메이션이 보인다.
            window.setTimeout(
              () => confirmMeeting(confirmMtg.id, event, time),
              280,
            );
          }}
        />
      )}

      {/* 괜찮은 일정 선택하기 — 초대받았어요 알림에서 연다 */}
      {replyMtg && (
        <MeetingReplyView
          key={replyMtg.id}
          open
          invite={replyMtg.info}
          onClose={() => setReplyMeetingId(null)}
          onSubmit={(hours, liked) => {
            // 답변만 기록한다. 화면은 완료 화면으로 넘어간 뒤 "홈으로"에서 닫힌다.
            submitReply(replyMtg.id, hours, liked);
            setNotifOpen(false);
          }}
        />
      )}

      {/* 회의 초대 보내기 — 선택 참여자 초대 알림에서 연다 */}
      {inviteMtg && inviteMtg.confirmedTime && (
        <MeetingInviteView
          key={inviteMtg.id}
          open
          meeting={{
            id: inviteMtg.id,
            topic: inviteMtg.info.topic,
            dateLabel: inviteMtg.info.dateLabel,
            time: inviteMtg.confirmedTime,
            participants: inviteMtg.info.participants,
          }}
          onClose={() => setInviteMeetingId(null)}
          onSend={() => {
            markOptionalSent(inviteMtg.id);
            setInviteMeetingId(null);
            setNotifOpen(false);
          }}
        />
      )}

      {/* 미참석 확인 알럿 (Figma 414:1598) */}
      {declineAlertOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-[24px]"
          onClick={() => setDeclineAlertOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="flex w-[545px] max-w-full flex-col items-center rounded-[36px] bg-white px-[40px] py-[36px] shadow-[0px_2px_40px_0px_rgba(204,204,204,0.5)]"
          >
            <h2 className="text-center text-[28px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
              ‘디자인 미팅’ 회의에 참석하지 않을게요
            </h2>
            <p className="mt-[9px] text-center text-[16px] font-normal leading-[1.6] tracking-[-0.5px] text-gray-700">
              주최자에게 미참석 알림이 전송돼요.
            </p>
            <div className="mt-[24px] flex items-center gap-[10px]">
              <button
                type="button"
                onClick={() => setDeclineAlertOpen(false)}
                className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-[#f3f4f5] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  markRead("opt-design-meeting");
                  setOptionalAnswer("decline");
                  setDeclineAlertOpen(false);
                }}
                className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
