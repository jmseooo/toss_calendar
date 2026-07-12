"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { WEEKDAYS, buildMonthGrid, yearMonthOf } from "@/lib/calendar";
import { useToday } from "./TodayContext";

interface DatePickerPopoverProps {
  /** 현재 선택된 날짜 ISO (YYYY-MM-DD). 없으면 null */
  value: string | null;
  /** 날짜 클릭 시 */
  onSelect: (iso: string) => void;
  className?: string;
}

/**
 * 월 달력 팝오버 (Figma "february" 피커).
 * 흰 카드 · 6주 그리드 · 이번 달은 진하게, 이전/다음 달은 흐리게.
 * 헤더의 ‹ › 로 월을 이동할 수 있다. (Figma 원본엔 화살표가 없지만
 * 여러 달을 오가려면 필요해 최소한으로 추가)
 *
 * 지난 날짜는 고를 수 없다. 오늘 이전 날짜는 비활성화하고,
 * 이번 달보다 앞으로는 넘어가지 못하게 ‹ 도 막는다.
 */
export default function DatePickerPopover({
  value,
  onSelect,
  className = "",
}: DatePickerPopoverProps) {
  const today = useToday();
  const seed = value ?? today;
  const { year: seedYear, month: seedMonth } = yearMonthOf(seed);
  const [view, setView] = useState({ year: seedYear, month: seedMonth });

  const cells = buildMonthGrid(view.year, view.month, today);

  // 이번 달(오늘이 속한 달)보다 앞으로는 갈 수 없다.
  const { year: todayYear, month: todayMonth } = yearMonthOf(today);
  const atFirstMonth =
    view.year < todayYear ||
    (view.year === todayYear && view.month <= todayMonth);

  function shiftMonth(delta: number) {
    setView((v) => {
      const m = v.month + delta;
      if (m < 1) return { year: v.year - 1, month: 12 };
      if (m > 12) return { year: v.year + 1, month: 1 };
      return { year: v.year, month: m };
    });
  }

  return (
    <div
      className={`w-[316px] rounded-[16px] border border-[#e0e0e0] bg-white p-[32px] shadow-[0px_20px_48px_0px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="flex w-[252px] flex-col gap-[16px]">
        {/* 월 헤더 */}
        <div className="flex h-[21px] items-center justify-between">
          <button
            type="button"
            aria-label="이전 달"
            disabled={atFirstMonth}
            onClick={() => shiftMonth(-1)}
            className="text-gray-700 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:text-carrot-600 disabled:cursor-not-allowed disabled:text-[#e0e0e0] disabled:hover:text-[#e0e0e0]"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="text-[16px] font-semibold text-[#333]">
            {view.month}월
          </span>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => shiftMonth(1)}
            className="text-gray-700 transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:text-carrot-600"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="flex h-[28px] items-center justify-center text-[10px] font-normal text-[#333]"
            >
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const selected = value === cell.date;
            const past = cell.date < today; // ISO 문자열이라 사전순 비교 = 날짜순 비교
            const disabled = !cell.inMonth || past;
            return (
              <button
                key={cell.date}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(cell.date)}
                className="flex aspect-square items-center justify-center disabled:cursor-not-allowed"
              >
                <span
                  className={[
                    "flex size-[30px] items-center justify-center rounded-full text-[16px] font-normal transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98]",
                    selected
                      ? "bg-carrot-600 text-white"
                      : disabled
                        ? "text-[#e0e0e0]"
                        : cell.isToday
                          ? "text-carrot-600"
                          : "text-[#333] hover:bg-gray-300",
                  ].join(" ")}
                >
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
