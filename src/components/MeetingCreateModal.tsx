"use client";

import { useEffect, useState } from "react";
import DatePickerPopover from "./DatePickerPopover";
import { WEEKDAYS } from "@/lib/calendar";
import { useToday } from "./TodayContext";

interface MeetingCreateModalProps {
  open: boolean;
  onClose: () => void;
  /** 마지막 단계에서 "다음" 클릭 시. (그 다음 뷰는 추후 연결) */
  onNext?: (data: {
    topic: string;
    startDate: string;
    endDate: string;
  }) => void;
}

type PickerTarget = "start" | "end" | null;

/** 24×24 달력 아이콘 (Figma icon_calendar_regular) */
function CalendarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 9.5H20.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.5 3.5V6.5M16.5 3.5V6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** "YYYY-MM-DD" → "26.07.02 (목)" */
function formatChip(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd} (${WEEKDAYS[d.getDay()]})`;
}

/**
 * "회의 생성" 플로우 — 딤 오버레이 위 모달.
 * step 1: 회의 주제 입력 / step 2: 회의 가능 범위 설정(시작·종료일 피커).
 * 카드/요소 크기·위치는 Figma(528×287) 좌표를 그대로 사용한다.
 */
export default function MeetingCreateModal({
  open,
  onClose,
  onNext,
}: MeetingCreateModalProps) {
  const today = useToday();
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  // 주제 입력 필드 포커스 여부 — 테두리 그리기 애니메이션에 쓴다
  const [focused, setFocused] = useState(false);
  const [picker, setPicker] = useState<PickerTarget>(null);

  // Esc 로 닫기. 초기화는 하지 않는다 — 부모가 key 로 다시 마운트해 주므로
  // 열 때마다 위 useState 초기값에서 새로 시작한다.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // 날짜 선택: 시작·종료 순서를 항상 시작 ≤ 종료로 유지.
  // "시작일만 선택해도 종료일은 같은 날짜로 자동 설정" 규칙 포함.
  function selectDate(iso: string) {
    if (picker === "start") {
      setStartDate(iso);
      setEndDate((prev) => (!prev || prev < iso ? iso : prev));
    } else if (picker === "end") {
      setEndDate(iso);
      setStartDate((prev) => (!prev || iso < prev ? iso : prev));
    }
    setPicker(null);
  }

  const startLabel = startDate ? formatChip(startDate) : formatChip(today);
  const endLabel = endDate ? formatChip(endDate) : formatChip(today);

  // 1단계는 주제를 입력해야 넘어간다. 2단계는 날짜를 비워도 오늘로 자동 설정된다.
  const trimmedTopic = topic.trim();
  const canProceed = step === 1 ? trimmedTopic.length > 0 : true;

  function goNext() {
    if (!canProceed) return;
    if (step === 1) {
      setStep(2);
    } else {
      onNext?.({
        topic: trimmedTopic,
        startDate: startDate ?? today,
        endDate: endDate ?? startDate ?? today,
      });
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="meeting-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-1000/60"
    >
      {/* 카드를 감싸는 래퍼(클리핑 X) — 피커가 카드 밖으로 떠도 잘리지 않게 */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          onClick={() => setPicker(null)}
          className="relative h-[287px] w-[528px] overflow-clip rounded-[36px] bg-gray-00 shadow-card"
        >
          {step === 1 ? (
            /* ── 1단계: 회의 주제 ── */
            <>
              <h2
                id="meeting-modal-title"
                className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-[24px] font-semibold leading-[1.6] tracking-[-0.5px] text-black"
              >
                회의 주제를 입력해주세요
              </h2>

              <div className="absolute left-1/2 top-[88px] h-[62px] w-[418px] -translate-x-1/2">
                <input
                  type="text"
                  autoFocus
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="예) 신규 부서 개설 논의 미팅"
                  className="h-full w-full rounded-[18px] bg-gray-300 px-[24px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-1000 outline-none placeholder:text-gray-600"
                />
                {/* 포커스하면 짧은 호가 테두리를 한 바퀴 돌고 사라진 뒤 3초 쉬었다 반복한다.
                    strokeDasharray "0.3 0.7" = 둘레의 30%만 그려진 선, 나머지는 빈 구간. */}
                <svg
                  viewBox="0 0 418 62"
                  fill="none"
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${
                    focused ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <rect
                    x="1"
                    y="1"
                    width="416"
                    height="60"
                    rx="17"
                    stroke="#ffb27a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.3 0.7"
                    className={focused ? "animate-trace-border" : ""}
                  />
                </svg>
              </div>
            </>
          ) : (
            /* ── 2단계: 회의 날짜 ── */
            <>
              <h2
                id="meeting-modal-title"
                className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-[24px] font-semibold leading-[1.6] tracking-[-0.5px] text-black"
              >
                회의 가능 범위를 설정해주세요
              </h2>

              <p className="absolute left-1/2 top-[78px] -translate-x-1/2 whitespace-nowrap text-[16px] font-normal leading-[1.6] tracking-[-0.5px] text-gray-700">
                동료들에게 가능한 시간을 물어보세요.
              </p>

              {/* 달력 아이콘 + 시작일 - 종료일 */}
              <div className="absolute left-[96px] top-[129px] flex items-center gap-[11px]">
                <span className="flex size-[24px] shrink-0 items-center justify-center text-gray-1000">
                  <CalendarIcon />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPicker((p) => (p === "start" ? null : "start"));
                  }}
                  className={`flex items-center justify-center rounded-[10px] bg-gray-300 px-[18px] py-[10px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 ${
                    startDate ? "text-gray-1000" : "text-gray-600"
                  }`}
                >
                  {startLabel}
                </button>
                <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
                  -
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPicker((p) => (p === "end" ? null : "end"));
                  }}
                  className={`flex items-center justify-center rounded-[10px] bg-gray-300 px-[18px] py-[10px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 ${
                    endDate ? "text-gray-1000" : "text-gray-600"
                  }`}
                >
                  {endLabel}
                </button>
              </div>
            </>
          )}

          {/* 취소 / 다음 (공통) */}
          <div className="absolute left-[191px] top-[204px] flex items-center gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-[#f3f4f5] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
            >
              취소
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-00 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
            >
              다음
            </button>
          </div>
        </div>

        {/* 날짜 피커 팝오버 — 카드 밖으로 떠서 표시 */}
        {step === 2 && picker && (
          <DatePickerPopover
            value={picker === "start" ? startDate : endDate}
            onSelect={selectDate}
            className={`absolute top-[186px] ${
              picker === "start" ? "left-[96px]" : "left-[212px]"
            }`}
          />
        )}
      </div>
    </div>
  );
}
