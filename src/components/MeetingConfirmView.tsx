"use client";

import { useEffect, useMemo, useState } from "react";
import { buildDaySlots } from "@/data/schedules";
import { CheckIcon } from "./icons";
import type { InviteInfo } from "./InviteContext";

interface MeetingConfirmViewProps {
  open: boolean;
  invite: InviteInfo;
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
  onClose,
  onConfirm,
}: MeetingConfirmViewProps) {
  const { topic, participants, startDate, dateLabel } = invite;

  // 참석자 전원이 안 되는 시간대는 고를 이유가 없어 숨긴다 (일정 찾기 화면과 같은 규칙).
  // 모두 가능한 시간대를 위로, 일부 불가능한 시간대를 아래로.
  const slots = useMemo(() => {
    const shown = buildDaySlots(participants, startDate).filter(
      (slot) => slot.blockedBy.length < participants.length,
    );
    const available = shown.filter((slot) => slot.blockedBy.length === 0);
    const blocked = shown.filter((slot) => slot.blockedBy.length > 0);
    return [...available, ...blocked];
  }, [participants, startDate]);

  // 1순위 = 모두 가능한 첫 시간대. 없으면 가장 적게 막힌 첫 시간대.
  const recommendedHour = slots[0]?.hour ?? null;
  const [selected, setSelected] = useState<number | null>(recommendedHour);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#f7f8f9]">
      {/* 카드가 남는 높이를 가져가 CTA까지 한 화면에 들어온다 (일정 찾기 화면과 같은 방식) */}
      <div className="mx-auto flex h-full min-h-[720px] w-[533px] max-w-full flex-col px-2 py-[40px]">
        {/* ── 헤더 ── */}
        <div className="pl-[3px]">
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
        <div className="mt-[28px] flex h-full min-h-0 max-h-[628px] flex-1 flex-col overflow-hidden rounded-[36px] bg-white px-[32px] pt-[44px] shadow-card">
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
              const attending = participants.length - slot.blockedBy.length;

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
                    className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition-colors ${
                      isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <CheckIcon size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelected(slot.hour)}
                    className={`flex flex-1 items-center gap-[8px] rounded-[22px] px-[24px] py-[18px] text-left transition-colors ${
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

                    {/* 그 시간에 올 수 있는 사람 수만큼 아바타를 겹쳐 그린다 */}
                    <div className="flex shrink-0">
                      {Array.from({
                        length: Math.min(attending, MAX_AVATARS),
                      }).map((_, i) => (
                        <span
                          key={i}
                          style={{ marginLeft: i === 0 ? 0 : -15 }}
                          className="size-[30px] shrink-0 rounded-full bg-gray-600"
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
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-[#f3f4f5] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition-colors hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            disabled={selected === null}
            onClick={() => selected !== null && onConfirm(selected)}
            className="flex h-[57px] flex-1 items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
          >
            일정 확정하기
          </button>
        </div>
      </div>
    </div>
  );
}
