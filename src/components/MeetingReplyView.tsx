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
    // 위아래 여백은 시안(1024 프레임) 그대로 — 헤더 위 108px, CTA 아래 73px.
    // 패딩이라 중앙 정렬과 같이 쓸 수 있고, 화면이 커지면 여백이 함께 늘어난다.
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#f7f8f9] px-2 pb-[73px] pt-[108px]">
      {/* max-h-full 은 패딩을 뺀 영역 기준이라 여백을 지키면서도 스크롤이 생기지 않고,
          세로가 모자라면 shrink 가 걸린 카드만 줄어든다 (헤더와 CTA는 shrink-0). */}
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
          {/* 후보 일정 라벨 + 전체 선택 */}
          <div className="flex shrink-0 items-center justify-between">
            <span className="pl-[3px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-700">
              후보 일정
            </span>
            <button
              type="button"
              onClick={() =>
                setChecked(
                  allChecked
                    ? new Set()
                    : new Set(visible.map((s) => s.hour)),
                )
              }
              className="flex h-[36px] w-[116px] shrink-0 items-center justify-center rounded-[18px] bg-[#f7f8f9] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-1000 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:bg-gray-300/70"
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
                  className="animate-slot-unfold flex shrink-0 items-center gap-[12px]"
                >
                  <button
                    type="button"
                    onClick={() => setChecked((prev) => toggle(prev, slot.hour))}
                    aria-pressed={isOn}
                    aria-label={`${slot.time} 선택`}
                    className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] ${
                      isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <CheckIcon size={18} />
                  </button>

                  <div
                    className={`flex flex-1 items-center gap-[8px] rounded-[22px] px-[24px] py-[18px] transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] ${
                      allFree ? "bg-[#f5f6ff]" : "border border-gray-400"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setChecked((prev) => toggle(prev, slot.hour))}
                      className="flex min-w-0 flex-1 flex-col items-start gap-[10px] text-left"
                    >
                      <span
                        className={`text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] ${
                          allFree ? "text-[#6373ff]" : "text-gray-1000"
                        }`}
                      >
                        {slot.time}
                      </span>
                      <span className="flex gap-[6px]">
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
                      </span>
                    </button>

                    {/* 좋아요 — 카드 안 오른쪽. 안 눌렀을 땐 배경에 은은히 묻힌다. */}
                    <button
                      type="button"
                      onClick={() => setLiked((prev) => toggle(prev, slot.hour))}
                      aria-pressed={isLiked}
                      aria-label={`${slot.time} 좋아요`}
                      className={`flex size-[44px] shrink-0 items-center justify-center transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] ${
                        isLiked
                          ? "text-carrot-600"
                          : allFree
                            ? "text-white hover:text-[#d8dcff]"
                            : "text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      <StarIcon size={40} filled />
                    </button>
                  </div>
                </div>
              );
            })}

            {!expanded && slots.length > INITIAL_SLOTS && (
              /* pl 45px = 체크박스 33 + gap 12. 위 일정 카드와 좌우를 맞춘다. */
              <div className="mt-[4px] flex shrink-0 pl-[45px]">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="flex h-[57px] flex-1 items-center justify-center rounded-[22px] border border-gray-400 text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-1000 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:bg-gray-300/40"
                >
                  다른 후보 더보기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── 시안 기준 470px(226 + 18 + 226). 카드보다 좁게, 가운데. */}
        <div className="mt-[29px] flex w-[470px] max-w-full shrink-0 items-center gap-[18px] self-center">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            disabled={checked.size === 0}
            onClick={() => onSubmit([...checked].sort((a, b) => a - b))}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
          >
            이 일정으로 전달하기
          </button>
        </div>
      </div>
    </div>
  );
}
