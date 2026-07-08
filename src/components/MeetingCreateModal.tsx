"use client";

import { useEffect, useState } from "react";
import DatePickerPopover from "./DatePickerPopover";
import { TODAY, WEEKDAYS } from "@/lib/calendar";

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
 * step 1: 회의 주제 입력 / step 2: 회의 날짜 입력(시작·종료일 피커).
 * 카드/요소 크기·위치는 Figma(528×287) 좌표를 그대로 사용한다.
 */
export default function MeetingCreateModal({
  open,
  onClose,
  onNext,
}: MeetingCreateModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [picker, setPicker] = useState<PickerTarget>(null);

  // 열릴 때마다 초기화 + Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setTopic("");
    setStartDate(null);
    setEndDate(null);
    setPicker(null);
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

  const startLabel = startDate ? formatChip(startDate) : formatChip(TODAY);
  const endLabel = endDate ? formatChip(endDate) : formatChip(TODAY);

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

              <input
                type="text"
                autoFocus
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예) 신규 부서 개설 논의 미팅"
                className="absolute left-1/2 top-[88px] h-[62px] w-[418px] -translate-x-1/2 rounded-[18px] bg-gray-300 px-[24px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-1000 outline-none placeholder:text-gray-600"
              />
            </>
          ) : (
            /* ── 2단계: 회의 날짜 ── */
            <>
              <h2
                id="meeting-modal-title"
                className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-[24px] font-semibold leading-[1.6] tracking-[-0.5px] text-black"
              >
                회의 날짜를 입력해주세요
              </h2>

              <p className="absolute left-1/2 top-[78px] -translate-x-1/2 whitespace-nowrap text-[16px] font-normal leading-[1.6] tracking-[-0.5px] text-gray-700">
                시작일만 선택해도, 종료일은 같은 날짜로 자동 설정돼요.
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
                  className={`flex items-center justify-center rounded-[10px] bg-gray-300 px-[18px] py-[10px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] transition-colors hover:brightness-95 ${
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
                  className={`flex items-center justify-center rounded-[10px] bg-gray-300 px-[18px] py-[10px] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] transition-colors hover:brightness-95 ${
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
              className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-[#f3f4f5] text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition-colors hover:brightness-95"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  onNext?.({
                    topic,
                    startDate: startDate ?? TODAY,
                    endDate: endDate ?? startDate ?? TODAY,
                  });
                }
              }}
              className="flex h-[48px] w-[136px] items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-00 transition-colors hover:brightness-95"
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
