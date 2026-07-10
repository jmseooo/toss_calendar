"use client";

import { useEffect, useMemo, useState } from "react";
import { buildDaySlots } from "@/data/schedules";
import { CheckIcon, StarIcon } from "./icons";
import type { InviteInfo } from "./InviteContext";

interface MeetingReplyViewProps {
  open: boolean;
  invite: InviteInfo;
  /** "뒤로" / Esc — 닫기 */
  onClose: () => void;
  /** "이 일정으로 전달하기" — 고른 시간대들로 답변 */
  onSubmit: (hours: number[]) => void;
}

/** 처음에 보여줄 후보 개수. 나머지는 "다른 후보 일정 더보기"로 편다. */
const INITIAL_SLOTS = 2;

/**
 * "괜찮은 일정을 선택해주세요" — 참여자 답변 화면 (Figma 243:5991).
 * 참여자 화면에서 사이드바 알림을 누르면 열린다.
 *
 * 주최자의 확정 화면(MeetingConfirmView)과 시간대 행·체크박스·참석자 칩이
 * 같은 규칙이다. 다른 점은 여러 개를 고를 수 있고, 행마다 "좋아요"(별)로
 * 선호를 표시할 수 있다는 것.
 */
export default function MeetingReplyView({
  open,
  invite,
  onClose,
  onSubmit,
}: MeetingReplyViewProps) {
  const { topic, participants, startDate } = invite;

  // 참석자 전원이 안 되는 시간대는 숨긴다. 모두 가능한 시간대를 위로.
  const slots = useMemo(() => {
    const shown = buildDaySlots(participants, startDate).filter(
      (slot) => slot.blockedBy.length < participants.length,
    );
    const available = shown.filter((slot) => slot.blockedBy.length === 0);
    const blocked = shown.filter((slot) => slot.blockedBy.length > 0);
    return [...available, ...blocked];
  }, [participants, startDate]);

  // 1순위(모두 가능한 첫 시간대)를 미리 골라둔다.
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(slots.length > 0 ? [slots[0].hour] : []),
  );
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const visible = expanded ? slots : slots.slice(0, INITIAL_SLOTS);
  const allChecked =
    visible.length > 0 && visible.every((s) => checked.has(s.hour));

  function toggle(set: Set<number>, hour: number) {
    const next = new Set(set);
    if (next.has(hour)) next.delete(hour);
    else next.add(hour);
    return next;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#f7f8f9] px-2 py-[24px]">
      {/* 화면 정중앙에 놓는다. max-h-full 이라 세로가 짧아도 스크롤이 생기지 않고,
          대신 shrink 가 걸린 카드만 줄어든다 (헤더와 CTA는 shrink-0). */}
      <div className="flex max-h-full w-[589px] max-w-full flex-col">
        {/* ── 헤더 ── */}
        <div className="shrink-0 pl-[3px]">
          <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
            <span className="text-carrot-600">{topic}</span> 회의 일정에
            초대받았어요.
          </p>
          <h1 className="mt-[10px] text-[28px] font-bold leading-[1.6] tracking-[-0.5px] text-black">
            괜찮은 일정을 선택해주세요.
          </h1>
          <p className="mt-[2px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800">
            가능 시간, 선호시간을 선택해 답변을 보내주세요.
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

          {/* 전체 선택 */}
          <div className="mt-[24px] flex items-center justify-end">
            <button
              type="button"
              onClick={() =>
                setChecked(
                  allChecked
                    ? new Set()
                    : new Set(visible.map((s) => s.hour)),
                )
              }
              className="flex h-[36px] w-[116px] shrink-0 items-center justify-center rounded-[18px] bg-[#f7f8f9] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-1000 transition-colors hover:bg-gray-300/70"
            >
              {allChecked ? "선택 해제" : "전체 선택"}
            </button>
          </div>

          {/* 시간대 목록 */}
          <div className="mt-[16px] flex flex-1 flex-col gap-[9px] overflow-y-auto pb-[44px] pr-[4px]">
            {visible.map((slot, index) => {
              const isOn = checked.has(slot.hour);
              const isLiked = liked.has(slot.hour);
              const allFree = slot.blockedBy.length === 0;

              return (
                <div
                  key={slot.hour}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className="animate-slot-unfold relative flex shrink-0 items-center gap-[12px]"
                >
                  {/* 첫 행 위에만 말풍선 안내. 꼬리가 체크박스를 가리키도록
                      오른쪽 끝을 체크박스에 맞추고 왼쪽으로 뻗는다. */}
                  {index === 0 && (
                    <div className="pointer-events-none absolute bottom-full left-[74px] z-10 flex -translate-x-full flex-col items-end pb-[4px]">
                      <div className="whitespace-nowrap rounded-[12px] bg-gray-1000 p-[10px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-[#f7f8f9]">
                        이중에 정말 좋은 시간이 있다면, ‘좋아요’를 눌러주세요!
                      </div>
                      <div className="mr-[12px] size-0 border-x-[7px] border-t-[8px] border-x-transparent border-t-gray-1000" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setLiked((prev) => toggle(prev, slot.hour))}
                    aria-pressed={isLiked}
                    aria-label={`${slot.time} 좋아요`}
                    className={`flex size-[40px] shrink-0 items-center justify-center transition-colors ${
                      isLiked ? "text-carrot-600" : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    <StarIcon size={32} filled />
                  </button>

                  <button
                    type="button"
                    onClick={() => setChecked((prev) => toggle(prev, slot.hour))}
                    aria-pressed={isOn}
                    aria-label={`${slot.time} 선택`}
                    className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition-colors ${
                      isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <CheckIcon size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setChecked((prev) => toggle(prev, slot.hour))}
                    className={`flex flex-1 items-center rounded-[22px] px-[24px] py-[18px] text-left transition-colors ${
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
                  </button>
                </div>
              );
            })}

            {!expanded && slots.length > INITIAL_SLOTS && (
              /* pl 97px = 별 40 + 12 + 체크박스 33 + 12. 일정 카드 기준으로 가운데 온다. */
              <div className="mt-[8px] flex shrink-0 justify-center pl-[97px]">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-[14px] font-semibold leading-[1.3] tracking-[-0.5px] text-black hover:underline"
                >
                  다른 후보 일정 더보기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-[29px] flex shrink-0 items-center gap-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-[#f3f4f5] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition-colors hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            disabled={checked.size === 0}
            onClick={() => onSubmit([...checked].sort((a, b) => a - b))}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
          >
            이 일정으로 전달하기
          </button>
        </div>
      </div>
    </div>
  );
}
