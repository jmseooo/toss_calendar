"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutMonthIcon,
  LayoutWeekIcon,
  PlusIcon,
} from "./icons";
import { useMonthView } from "./MonthViewContext";
import { useWeekView } from "./WeekViewContext";
import { useViewMode } from "./ViewModeContext";
import MeetingCreateModal from "./MeetingCreateModal";
import RequiredAttendeesView from "./RequiredAttendeesView";
import { yearMonthOf } from "@/lib/calendar";

/**
 * 캘린더 상단 툴바.
 * 제목 · 이전/다음 · 오늘 · 뷰 토글 · "일정 생성하기".
 * 이전/다음 화살표와 "오늘" 버튼은 현재 모드(월간/주간)에 맞춰
 * 표시 중인 월 또는 주를 실제로 바꾼다.
 */
export default function CalendarToolbar() {
  const { mode, setMode } = useViewMode();
  const monthView = useMonthView();
  const weekView = useWeekView();

  // "일정 생성하기" 드롭다운 열림 상태 + 바깥 클릭 시 닫기
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // "회의 생성" 모달 열림 상태
  const [meetingOpen, setMeetingOpen] = useState(false);

  // 날짜 선택 후 진입하는 "필수 참석자 일정 찾기" 화면 데이터
  const [attendeesData, setAttendeesData] = useState<{
    topic: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  // 주간 모드에서는 기준 주(anchor)가 속한 연·월을 제목으로 쓰고,
  // 이동/오늘 동작도 주 단위로 전환한다. (그 외엔 월간 동작)
  const isWeek = mode === "week";
  const { year, month } = isWeek
    ? yearMonthOf(weekView.anchor)
    : { year: monthView.year, month: monthView.month };
  const goPrev = isWeek ? weekView.goPrev : monthView.goPrev;
  const goNext = isWeek ? weekView.goNext : monthView.goNext;
  const goToday = isWeek ? weekView.goToday : monthView.goToday;

  return (
    <div className="flex min-h-[57px] w-full items-center justify-between gap-x-[12px]">
      <div className="flex min-w-0 items-center gap-[10px] xl:gap-[18px]">
        {/* 월 제목 + 이동 화살표 */}
        <div className="flex items-center gap-[6px] xl:gap-[10px]">
          <h1 className="whitespace-nowrap text-[20px] font-semibold leading-[1.6] text-gray-1000 xl:text-[24px]">
            {year}년 {month}월
          </h1>
          <button
            type="button"
            aria-label={isWeek ? "이전 주" : "이전 달"}
            onClick={goPrev}
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <button
            type="button"
            aria-label={isWeek ? "다음 주" : "다음 달"}
            onClick={goNext}
            className="text-gray-1000 transition-colors hover:text-carrot-600"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>

        <div className="flex items-center gap-[10px] xl:gap-[18px]">
          {/* 오늘 버튼 */}
          <button
            type="button"
            onClick={goToday}
            className="flex h-[38px] w-[60px] shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-00 text-[16px] font-semibold leading-[1.6] text-gray-1000 shadow-card transition-colors hover:bg-gray-300/50 xl:w-[72px]"
          >
            오늘
          </button>

          {/* 뷰 토글 */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="월간 보기"
              aria-pressed={mode === "month"}
              onClick={() => setMode("month")}
              className={
                mode === "month" ? "text-gray-700" : "text-gray-400"
              }
            >
              <LayoutMonthIcon size={24} />
            </button>
            <button
              type="button"
              aria-label="주간 보기"
              aria-pressed={mode === "week"}
              onClick={() => setMode("week")}
              className={
                mode === "week" ? "text-gray-700" : "text-gray-400"
              }
            >
              <LayoutWeekIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 일정 생성하기 — 클릭 시 아래로 드롭다운(일정 추가 / 회의 생성) */}
      <div ref={menuRef} className="relative shrink-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-[42px] w-[128px] shrink-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-carrot-600 text-[15px] font-semibold text-gray-00 transition-colors hover:brightness-95 xl:w-[144px] xl:gap-[8px] xl:text-[16px]"
        >
          <PlusIcon size={16} />
          일정 생성하기
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+10px)] z-20 w-[183px] rounded-[20px] bg-[rgba(255,255,255,0.92)] px-[10px] py-[14px] shadow-[0px_2px_40px_0px_rgba(0,0,0,0.18)] backdrop-blur-[2px]"
          >
            {/* 일정 추가 — 비활성 */}
            <button
              type="button"
              role="menuitem"
              disabled
              aria-disabled="true"
              className="flex w-full cursor-not-allowed items-center justify-center px-[24px] py-[6px] text-center text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-400"
            >
              일정 추가
            </button>
            {/* 회의 생성 — 활성 */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setMeetingOpen(true);
              }}
              className="flex w-full items-center justify-center rounded-[12px] px-[14px] py-[6px] text-center text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition-colors hover:bg-gray-300/60"
            >
              회의 생성
            </button>
          </div>
        )}
      </div>

      {/* 회의 생성 모달 */}
      <MeetingCreateModal
        open={meetingOpen}
        onClose={() => setMeetingOpen(false)}
        onNext={(data) => {
          // 날짜 선택 완료 → 모달 닫고 "필수 참석자 일정 찾기" 화면으로 진입
          setMeetingOpen(false);
          setAttendeesData(data);
        }}
      />

      {/* 필수 참석자 일정 찾기 화면 — 진입할 때마다 초기 상태로 새로 마운트 */}
      <RequiredAttendeesView
        key={attendeesData ? "attendees-open" : "attendees-closed"}
        open={attendeesData !== null}
        topic={attendeesData?.topic ?? ""}
        startDate={attendeesData?.startDate ?? ""}
        onBack={() => {
          // 뒤로 → 회의 생성 모달로 복귀
          setAttendeesData(null);
          setMeetingOpen(true);
        }}
        onClose={() => setAttendeesData(null)}
      />
    </div>
  );
}
