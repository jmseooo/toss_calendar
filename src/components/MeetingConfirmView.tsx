"use client";

import { useEffect, useMemo, useState } from "react";
import { buildDaySlots } from "@/data/schedules";
import { CheckIcon } from "./icons";
import CompletionGlow from "./CompletionGlow";
import Avatar from "./Avatar";
import type { InviteInfo } from "./InviteContext";

interface MeetingConfirmViewProps {
  open: boolean;
  invite: InviteInfo;
  /** 참여자가 답변에서 고른 시간대(hour) — 확정 화면엔 이 시간대만 보여준다 */
  selectedHours: number[];
  /** 초대자가 답변에서 고른(또는 좋아요한) 시간대 — 처음 선택 상태의 기본값 */
  initialHour?: number;
  /** "뒤로" / Esc — 닫기 */
  onClose: () => void;
  /** "일정 확정하기" — 고른 시간대로 확정 */
  onConfirm: (hour: number) => void;
}

/** 겹쳐 그릴 아바타 최대 개수 */
const MAX_AVATARS = 4;

/**
 * "회의 일정 확정하기" 화면 (Figma 215:10619).
 * 사이드바 알림(참석자가 일정을 선택했습니다)을 누르면 열린다.
 *
 * 시간대 행·체크박스·참석자 칩은 RequiredAttendeesView 에 이미 구현된 것과
 * 같은 규칙을 쓴다. 다른 점은 카드가 하나뿐이고, 여러 개를 고르는 게 아니라
 * 확정할 시간대 하나만 고른다는 것.
 */
export default function MeetingConfirmView({
  open,
  invite,
  selectedHours,
  initialHour,
  onClose,
  onConfirm,
}: MeetingConfirmViewProps) {
  const { topic, participants, startDate, dateLabel } = invite;

  // 참여자가 고른 시간대만 보여준다. 모두 가능한 시간대를 위로, 일부 불가능한 시간대를 아래로.
  const slots = useMemo(() => {
    const picked = new Set(selectedHours);
    const shown = buildDaySlots(participants, startDate).filter(
      (slot) => picked.has(slot.hour),
    );
    const available = shown.filter((slot) => slot.blockedBy.length === 0);
    const blocked = shown.filter((slot) => slot.blockedBy.length > 0);
    return [...available, ...blocked];
  }, [participants, startDate, selectedHours]);

  // 기본 선택 = 초대자가 고른 시간대(있고 목록에 남아 있으면). 없으면 1순위(첫 시간대).
  const defaultHour =
    initialHour != null && slots.some((s) => s.hour === initialHour)
      ? initialHour
      : (slots[0]?.hour ?? null);
  const [selected, setSelected] = useState<number | null>(defaultHour);
  // 확정하기를 누르면 완료 화면으로 전환한다.
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const selectedTime = slots.find((s) => s.hour === selected)?.time ?? "";

  // ── 확정 완료 화면 (Figma 243:7319 계열) ──
  if (confirmed) {
    return (
      <div className="fixed inset-0 z-50 isolate flex flex-col items-center justify-center overflow-hidden bg-white px-[24px] py-[40px]">
        <CompletionGlow />
        <div className="flex size-[46px] items-center justify-center rounded-full bg-[#ff9364] text-white">
          <CheckIcon size={26} />
        </div>
        <h1 className="mt-[24px] text-center text-[28px] font-bold leading-[1.5] tracking-[-0.5px] text-gray-1000">
          회의 일정을 확정하고,
          <br />
          필수 참석자들에게 알렸어요
        </h1>

        <div className="mt-[36px] flex w-[738px] max-w-full flex-col items-center gap-[20px] rounded-[30px] bg-white px-[40px] py-[36px] shadow-card">
          <div className="flex items-center gap-[10px]">
            <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
              {topic}
            </span>
            <span className="size-[6px] rounded-full bg-[#cfd4dd]" />
            <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
              {dateLabel} {selectedTime}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-[12px]">
            {participants.map((n, i) => (
              <div
                key={`${n}-${i}`}
                className="flex items-center gap-[11px] rounded-[16px] border border-gray-300 bg-white px-[16px] py-[10px]"
              >
                <Avatar name={n} className="size-[30px]" />
                <span className="whitespace-nowrap text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
                  {n}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[36px] flex items-center gap-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] w-[228px] items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-carrot-600 shadow-card transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            참석자 추가하기
          </button>
          <button
            type="button"
            onClick={() => selected !== null && onConfirm(selected)}
            className="flex h-[57px] w-[228px] items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            캘린더에서 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    // 위아래 여백은 시안(1024 프레임) 그대로 — 헤더 위 108px, CTA 아래 73px.
    // 패딩이라 중앙 정렬과 같이 쓸 수 있고, 화면이 커지면 여백이 함께 늘어난다.
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#f7f8f9] px-2 pb-[73px] pt-[108px]">
      {/* max-h-full 은 패딩을 뺀 영역 기준이라 여백을 지키면서도 스크롤이 생기지 않고,
          세로가 모자라면 shrink 가 걸린 카드만 줄어든다 (헤더와 CTA는 shrink-0). */}
      <div className="flex max-h-full w-[533px] max-w-full flex-col">
        {/* ── 헤더 ── */}
        <div className="shrink-0 pl-[3px]">
          <div className="flex items-center gap-[8px] text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
            <span className="whitespace-nowrap">{topic}</span>
            <span className="size-[6px] rounded-full bg-[#cfd4dd]" />
            <span className="whitespace-nowrap">{dateLabel}</span>
          </div>
          <h1 className="mt-[10px] text-[28px] font-bold leading-[1.6] tracking-[-0.5px] text-black">
            회의 일정 확정하기
          </h1>
          <p className="mt-[2px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800">
            필수 참석자들이 선택한 일정 결과예요. 1순위 일정을 추천드려요
          </p>
        </div>

        {/* ── 카드 ── */}
        <div className="mt-[28px] flex h-[628px] min-h-0 flex-col overflow-hidden rounded-[36px] bg-white px-[32px] pt-[44px] shadow-card">
          {/* 참석 라벨 + 참석자 칩 */}
          <div className="flex flex-wrap items-center gap-[10px] pl-[3px]">
            <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
              참석
            </span>
            {participants.map((n) => (
              <span
                key={n}
                className="flex h-[36px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border border-gray-300 px-[10px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800"
              >
                {n}
              </span>
            ))}
          </div>

          {/* 시간대 목록 — 하나만 고른다 */}
          <div className="mt-[20px] flex flex-1 flex-col gap-[9px] overflow-y-auto pb-[44px] pr-[4px]">
            {slots.map((slot, index) => {
              const isOn = selected === slot.hour;
              const allFree = slot.blockedBy.length === 0;

              return (
                <div
                  key={slot.hour}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className="animate-slot-unfold flex shrink-0 items-center gap-[12px]"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(slot.hour)}
                    aria-pressed={isOn}
                    aria-label={`${slot.time} 선택`}
                    className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] ${
                      isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <CheckIcon size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelected(slot.hour)}
                    className={`flex flex-1 items-center gap-[8px] rounded-[22px] px-[24px] py-[18px] text-left transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] ${
                      allFree
                        ? "bg-[#f5f6ff]"
                        : "border border-gray-400 hover:bg-gray-300/40"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                      <div className="flex gap-[6px]">
                        {allFree ? (
                          <>
                            <span className="rounded-[6px] bg-[#d8dcff] p-[6px] text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#6373ff]">
                              모두 가능
                            </span>
                            {/* 1순위는 첫 행 하나뿐 */}
                            {index === 0 && (
                              <span className="rounded-[6px] bg-white p-[6px] text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#6373ff]">
                                선호도 최상
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="rounded-[6px] bg-gray-300 p-[6px] text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
                            {slot.blockedBy.length}명 불가능
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] ${
                          allFree ? "text-[#6373ff]" : "text-gray-1000"
                        }`}
                      >
                        {slot.time}
                      </span>
                    </div>

                    {/* 그 시간에 올 수 있는 참석자들의 프로필을 겹쳐 그린다 */}
                    <div className="flex shrink-0">
                      {participants
                        .filter(
                          (p) => !slot.blockedBy.some((b) => b.name === p),
                        )
                        .slice(0, MAX_AVATARS)
                        .map((p, i) => (
                          <Avatar
                            key={p}
                            name={p}
                            className="size-[30px] ring-2 ring-white"
                            style={{ marginLeft: i === 0 ? 0 : -15 }}
                          />
                        ))}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-[29px] flex shrink-0 items-center gap-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            disabled={selected === null}
            onClick={() => selected !== null && setConfirmed(true)}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
          >
            일정 확정하기
          </button>
        </div>
      </div>
    </div>
  );
}
