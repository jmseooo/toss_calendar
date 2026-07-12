"use client";

import { useState } from "react";
import Image from "next/image";
import { BellIcon, SearchIcon, ChatIcon } from "./icons";
import { useInvite } from "./InviteContext";
import { useViewMode } from "./ViewModeContext";
import { useWeekView } from "./WeekViewContext";
import { SELF } from "@/data/people";
import { WEEKDAYS } from "@/lib/calendar";
import MeetingConfirmView from "./MeetingConfirmView";
import MeetingReplyView from "./MeetingReplyView";

/** "2026-07-02" → "7/2 (목)" */
function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
}

/** 09 → "09:00" */
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;

/**
 * 좌측 사이드바 — 가로폭에 따라 비례 축소.
 * 아이콘 열 너비: 52px(기본) → 62px(sm) → 72px(xl). aside와 아이콘 열의 너비는 같아야 한다.
 * 알림 벨을 누르면 사이드바가 넓어지며(팝업 아님) 그 안에 "읽지 않은 알림" 리스트가 펼쳐진다.
 * 알림은 초대를 보낸 뒤에만 생긴다.
 */
export default function Sidebar() {
  const { invite, clearInvite, role, reply, submitReply, confirmMeeting } =
    useInvite();
  const { setMode } = useViewMode();
  const { goToDate } = useWeekView();
  const replied = reply !== null;
  const [notifOpen, setNotifOpen] = useState(false);
  // 알림을 누르면 "회의 일정 확정하기" 전체 화면이 열린다.
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 참여자 화면에서 알림을 누르면 "괜찮은 일정을 선택해주세요" 화면이 열린다.
  const [replyOpen, setReplyOpen] = useState(false);

  // 역할을 바꾸면 그쪽 알림이 먼저 보이도록 알림 패널을 펼친다.
  // 이펙트가 아니라 렌더 중에 조정한다 (React 권장 패턴).
  const [prevRole, setPrevRole] = useState(role);
  if (prevRole !== role) {
    setPrevRole(role);
    setNotifOpen(true);
    setConfirmOpen(false);
    setReplyOpen(false);
  }

  // 알림 내용은 주최자가 초대를 보낼 때 넘긴 실제 데이터(주제·참석자·날짜)로 채운다.
  // 참여자는 "초대받았다", 주최자는 "답변이 왔다"는 같은 초대 건을 서로 다르게 본다.
  const isInvitee = role === "invitee";
  // 참여자는 초대받는 즉시 알림 1건. 주최자는 참여자가 실제로 답변을 보낸 뒤에만
  // (답변 도착 + 일정 확정) 2건이 뜬다. 초대만 보낸 상태에선 주최자에게 알림이 없다.
  const hasNotif = invite !== null && (isInvitee || replied);
  const notifCount = hasNotif ? (isInvitee ? 1 : 2) : 0;
  const replyCount = invite?.participants.length ?? 0;
  // "선택했습니다" 알림에 쓸 이름 — 주최자가 고른 필수 참여자 중 나(SELF)를 뺀 첫 번째.
  const replierName =
    invite?.participants.find((n) => n !== SELF) ??
    invite?.participants[0] ??
    "참여자";

  return (
    <aside
      className={`flex h-full shrink-0 overflow-hidden border-r border-gray-400/40 bg-gray-00/70 transition-[width] duration-300 ease-out ${
        notifOpen ? "w-[380px]" : "w-[52px] sm:w-[62px] xl:w-[72px]"
      }`}
    >
      {/* 아이콘 열 */}
      <div className="flex w-[52px] shrink-0 flex-col items-center pt-[16px] sm:w-[62px] sm:pt-[20px] xl:w-[72px] xl:pt-[23px]">
        {/* 로고 */}
        {/* width/height는 원본 픽셀(240x240) 그대로 둔다. 60을 주면 next/image가
            60px로 줄여 다시 인코딩한 것을 내려보내 고해상도 화면에서 뭉개진다.
            37KB짜리 로고라 최적화 이득이 없어 unoptimized로 원본을 그대로 쓴다. */}
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
            {/* 새 알림 점 — 볼 알림이 있을 때만 표시 */}
            {hasNotif && (
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

      {/* 알림 패널 — 사이드바가 넓어지며 인라인으로 표시 */}
      {notifOpen && (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto pt-[30px] pr-[14px]">
          <p className="pl-[4px] text-[24px] font-semibold leading-[1.4] tracking-[-0.5px] text-gray-1000">
            읽지 않은 알림 ({notifCount})
          </p>

          {hasNotif ? (
            <div className="mt-[14px] flex flex-col gap-[2px]">
              {isInvitee ? (
                replied ? (
                  /* 참여자가 일정을 선택한 뒤 — 선택 완료 알림 */
                  <div className="flex flex-col gap-[10px] rounded-[22px] px-[14px] py-[18px]">
                    <div className="flex items-start gap-[6px]">
                      <span className="size-[24px] shrink-0 rounded-full bg-gray-600" />
                      <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                        {replierName}
                      </span>
                      <span className="mt-[2px] size-[8px] shrink-0 rounded-full bg-[#ff6a60]" />
                    </div>
                    <p className="pl-[2px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                      ‘{invite.topic}’ 회의 일정을 선택했습니다.
                    </p>
                    <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
                      {formatShortDate(invite.startDate)} {invite.recommendedTime}
                    </p>
                  </div>
                ) : (
                  /* 초대자(참여자) 화면 — 초대를 받았다는 알림. 누르면 답변 화면 */
                  <button
                    type="button"
                    onClick={() => setReplyOpen(true)}
                    className="transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] flex flex-col gap-[10px] rounded-[22px] px-[14px] py-[18px] text-left hover:bg-gray-100/60"
                  >
                    <div className="flex flex-col gap-[8px]">
                      <div className="flex items-start gap-[6px]">
                        <span className="size-[24px] shrink-0 rounded-full bg-gray-600" />
                        <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                          참여자
                        </span>
                        <span className="mt-[2px] size-[8px] shrink-0 rounded-full bg-[#ff6a60]" />
                      </div>
                      <p className="pl-[2px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                        ‘{invite.topic}’ 회의 일정에 초대했어요.
                      </p>
                    </div>
                    <p className="pl-[4px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                      가능 시간을 선택해 답변해주세요.
                    </p>
                  </button>
                )
              ) : (
                /* 주최자 화면 — 답변 도착 알림 + 일정 확정 알림, 두 건. */
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    className="transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] flex flex-col gap-[8px] rounded-[22px] px-[14px] py-[18px] text-left hover:bg-gray-100/60"
                  >
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                        ‘{invite.topic}’ 회의 일정
                      </span>
                      <span className="size-[8px] shrink-0 rounded-full bg-[#ff6a60]" />
                    </div>
                    <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                      {replyCount}명의 참여자가 답변을 전송했습니다.
                    </p>
                    <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
                      {invite.participants.join(", ")}
                    </p>
                  </button>

                  {/* 일정 확정 알림 — 누르면 "회의 일정 확정하기" 화면으로 이동 */}
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    className="transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] flex flex-col gap-[8px] rounded-[22px] px-[14px] py-[18px] text-left hover:bg-gray-100/60"
                  >
                    <div className="flex items-start gap-[8px]">
                      <p className="flex-1 text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                        ‘{invite.topic}’ 회의 일정을 확정할 수 있어요.
                      </p>
                      <span className="mt-[2px] size-[8px] shrink-0 rounded-full bg-[#ff6a60]" />
                    </div>
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="mt-[16px] rounded-[18px] bg-gray-100/70 px-[16px] py-[24px] text-center text-[14px] font-medium leading-[1.5] tracking-[-0.5px] text-gray-600">
              새 알림이 없어요
            </p>
          )}
        </div>
      )}

      {/* 회의 일정 확정하기 — 주최자만. 알림을 누를 때마다 초기 상태로 새로 마운트 */}
      {invite && !isInvitee && (
        <MeetingConfirmView
          key={confirmOpen ? "confirm-open" : "confirm-closed"}
          open={confirmOpen}
          invite={invite}
          // 초대자가 좋아요한 시간대를 우선, 없으면 첫 번째 선택한 시간대를 기본 선택으로
          initialHour={reply?.liked[0] ?? reply?.hours[0]}
          onClose={() => setConfirmOpen(false)}
          onConfirm={(hour) => {
            // 확정한 회의를 캘린더 이벤트로 만든다.
            const event = {
              id: `confirmed-${invite.startDate}-${hour}`,
              date: invite.startDate,
              title: invite.topic,
              color: "blue" as const,
              chip: "line" as const,
              startTime: hourLabel(hour),
              endTime: hourLabel(hour + 1),
              attendeeCount: invite.participants.length,
            };
            // 먼저 주간 뷰의 그 주로 전환하고 오버레이를 닫는다.
            goToDate(invite.startDate);
            setMode("week");
            setConfirmOpen(false);
            setNotifOpen(false);
            clearInvite();
            // 뷰 전환이 끝난 뒤 블록을 얹어야 펼침 애니메이션이 화면에서 보인다.
            window.setTimeout(() => confirmMeeting(event), 280);
          }}
        />
      )}

      {/* 괜찮은 일정 선택하기 — 참여자만. 답변을 보내면 화면을 닫는다. */}
      {invite && isInvitee && (
        <MeetingReplyView
          key={replyOpen ? "reply-open" : "reply-closed"}
          open={replyOpen}
          invite={invite}
          onClose={() => setReplyOpen(false)}
          onSubmit={(hours, liked) => {
            // 참여자가 고른 시간대를 저장하면 주최자 쪽에 "일정 확정" 알림이 생긴다.
            submitReply(hours, liked);
            setReplyOpen(false);
            setNotifOpen(false);
          }}
        />
      )}
    </aside>
  );
}
