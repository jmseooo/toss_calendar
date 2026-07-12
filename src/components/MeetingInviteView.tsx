"use client";

import { useEffect, useState } from "react";
import { PEOPLE } from "@/data/people";
import { CheckIcon, CloseIcon, SearchIcon, SendIcon } from "./icons";
import type { ConfirmedMeeting } from "./InviteContext";

interface MeetingInviteViewProps {
  open: boolean;
  meeting: ConfirmedMeeting;
  /** "뒤로" / Esc */
  onClose: () => void;
  /** "초대 보내기" — 고른 선택 참여자들로 초대 */
  onSend: (names: string[]) => void;
}

/** 최근검색에 보여줄 선택 참여자 후보 (필수 참석자·본인 제외한 명단 앞부분) */
const RECENT_POOL = PEOPLE.slice(1);

/**
 * "회의 초대 보내기" — 확정한 회의에 선택(옵션) 참여자를 초대하는 화면 (Figma 243:7045 계열).
 * 필수 참석자 일정 찾기 화면과 검색·최근 목록·선택 목록·헤더·버튼 스타일을 공유한다.
 * 다른 점은 시간대 계산이 없고, 고른 사람을 그대로 초대한다는 것.
 */
export default function MeetingInviteView({
  open,
  meeting,
  onClose,
  onSend,
}: MeetingInviteViewProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  // 초대 보내기를 누르면 완료 화면으로 전환한다.
  const [sent, setSent] = useState(false);

  // 최근검색 후보: 이 회의의 필수 참석자로 이미 들어간 사람은 뺀다.
  const recent = RECENT_POOL.filter((n) => !meeting.participants.includes(n)).slice(
    0,
    5,
  );

  const q = query.trim();
  const results = q
    ? PEOPLE.filter((n) => n.includes(q) && !selected.includes(n))
    : [];

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // ── 초대 완료 화면 ──
  if (sent) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto px-[24px] py-[40px]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, #ffe9dd 0%, #ffffff 55%)",
        }}
      >
        <div className="flex size-[92px] items-center justify-center rounded-full bg-[#ff9364] text-white">
          <CheckIcon size={44} />
        </div>
        <h1 className="mt-[24px] text-center text-[28px] font-bold leading-[1.5] tracking-[-0.5px] text-gray-1000">
          회의 초대를 완료했어요
        </h1>

        <div className="mt-[36px] flex w-[738px] max-w-full flex-col items-center gap-[20px] rounded-[30px] bg-white px-[40px] py-[36px] shadow-card">
          <div className="flex items-center gap-[10px]">
            <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
              {meeting.topic}
            </span>
            <span className="size-[6px] rounded-full bg-[#cfd4dd]" />
            <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-600">
              {meeting.dateLabel} {meeting.time}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-[12px]">
            {selected.map((n, i) => (
              <div
                key={`${n}-${i}`}
                className="flex items-center gap-[11px] rounded-[16px] border border-gray-300 bg-white px-[16px] py-[10px]"
              >
                <span className="size-[30px] shrink-0 rounded-full bg-gray-600" />
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
            onClick={() => onSend(selected)}
            className="flex h-[57px] w-[228px] items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-carrot-600 shadow-card transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            홈으로
          </button>
          <button
            type="button"
            onClick={() => onSend(selected)}
            className="flex h-[57px] w-[228px] items-center justify-center rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            완료
          </button>
        </div>
      </div>
    );
  }

  function add(name: string) {
    setSelected((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }
  function remove(name: string) {
    setSelected((prev) => prev.filter((n) => n !== name));
  }

  return (
    // 위아래 여백·중앙 정렬을 확정/답변 화면과 같은 시스템으로 맞춘다.
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gradient-to-b from-white to-[#ffefe4] px-2 pb-[73px] pt-[108px]">
      <div className="flex max-h-full w-[919px] max-w-full flex-col">
        {/* ── 제목 ── */}
        <div className="shrink-0 pl-[3px]">
          <h1 className="text-[28px] font-bold leading-[1.6] tracking-[-0.5px] text-black">
            회의 초대 보내기
          </h1>
          <p className="mt-[2px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800">
            선택 참여자들은 참석 혹은 미참석만 선택할 수 있어요.
          </p>
        </div>

        {/* ── 메타 줄: 주제·날짜 / 참석자 칩 ── */}
        <div className="mt-[24px] flex shrink-0 flex-wrap items-center gap-x-[10px] gap-y-[8px] pl-[3px]">
          <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
            {meeting.topic}
          </span>
          <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-ev-blue">
            {meeting.dateLabel} {meeting.time}
          </span>
          <span className="ml-auto text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
            참석자
          </span>
          {meeting.participants.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="flex h-[36px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border border-gray-300 px-[10px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800"
            >
              {n}
            </span>
          ))}
        </div>

        {/* ── 카드: 좌측 검색·최근 / 우측 참석 ── */}
        <div className="mt-[28px] flex h-[628px] min-h-0 gap-[40px] overflow-hidden rounded-[36px] bg-white px-[40px] py-[40px] shadow-card">
          {/* 좌측 */}
          <div className="relative w-[399px] shrink-0 overflow-y-auto">
            {/* 검색 바 */}
            <div className="flex h-[42px] items-center gap-[8px] rounded-[24px] bg-[#f7f8f9] pl-[18px] pr-[15px]">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="필수 참석자를 검색해보세요"
                className="min-w-0 flex-1 bg-transparent text-[17px] font-medium leading-[1.6] tracking-[-0.5px] text-gray-1000 outline-none placeholder:text-gray-600"
              />
              <SearchIcon size={24} className="shrink-0 text-gray-600" />
            </div>

            {/* 검색 결과 시트 */}
            {results.length > 0 && (
              <div className="absolute inset-x-0 top-[52px] z-10 overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_40px_0px_rgba(0,0,0,0.18)]">
                <div className="flex max-h-[320px] flex-col gap-[8px] overflow-y-auto px-[27px] py-[23px]">
                  {results.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => add(name)}
                      className="group flex items-center justify-between rounded-[12px] px-[18px] py-[3px] text-left transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-[11px]">
                        <span className="size-[30px] shrink-0 rounded-full bg-gray-600" />
                        <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-900">
                          {name}
                        </span>
                      </div>
                      <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 opacity-0 transition-opacity group-hover:opacity-100">
                        추가
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 최근검색 */}
            <p className="mt-[20px] pl-[20px] text-[13px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-700">
              최근검색
            </p>
            <div className="mt-[11px] flex flex-col gap-[10px]">
              {recent.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => add(name)}
                  className="group flex items-center justify-between rounded-[12px] px-[18px] py-[3px] text-left transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] hover:bg-[#f7f8f9]"
                >
                  <div className="flex items-center gap-[11px]">
                    <span className="size-[30px] shrink-0 rounded-full bg-gray-600" />
                    <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-900">
                      {name}
                    </span>
                  </div>
                  <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 opacity-0 transition-opacity group-hover:opacity-100">
                    추가
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 우측 — 참석(선택한 사람) */}
          <div className="min-w-0 flex-1 overflow-y-auto">
            <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-1000">
              참석
            </p>
            {selected.length === 0 ? (
              <p className="mt-[24px] text-[16px] font-medium leading-[1.6] tracking-[-0.5px] text-gray-600">
                선택하면 여기에 표시됩니다
              </p>
            ) : (
              <div className="mt-[20px] flex flex-wrap gap-[10px]">
                {selected.map((n) => (
                  <span
                    key={n}
                    className="flex h-[36px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-[6px] border border-gray-300 pl-[10px] pr-[7px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800"
                  >
                    {n}
                    <button
                      type="button"
                      onClick={() => remove(n)}
                      aria-label={`${n} 삭제`}
                      className="shrink-0 text-gray-500 transition-colors hover:text-gray-800"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-[29px] flex shrink-0 items-center justify-end gap-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] w-[183px] items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 shadow-card transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => setSent(true)}
            className="flex h-[57px] w-[232px] items-center justify-center gap-[8px] rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:brightness-100"
          >
            초대 보내기
            <SendIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
