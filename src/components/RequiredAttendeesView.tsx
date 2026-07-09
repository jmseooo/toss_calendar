"use client";

import { useEffect, useMemo, useState } from "react";
import { WEEKDAYS } from "@/lib/calendar";
import { PEOPLE } from "@/data/people";
import { buildDaySlots } from "@/data/schedules";
import { CheckIcon, CloseIcon, SearchIcon, SendIcon, TrashIcon } from "./icons";

interface RequiredAttendeesViewProps {
  open: boolean;
  /** 회의 주제 (모달 1단계에서 입력) */
  topic: string;
  /** 선택한 시작일 "YYYY-MM-DD" */
  startDate: string;
  /** "뒤로" — 날짜 입력 단계로 돌아가기 */
  onBack: () => void;
  /** "선택 날짜 초대 보내기" / 닫기 */
  onClose: () => void;
}

/** "YYYY-MM-DD" → "07.02 (목)" */
function formatHeaderDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd} (${WEEKDAYS[d.getDay()]})`;
}

/* 검색 대상 전체 명단 — src/data/people.ts 에서 관리 */
const DIRECTORY = PEOPLE;

/* 좌측 카드 — 최근 필수 참석자 목록 (Figma 시안 기준 목업 데이터) */
const RECENT = [
  { name: "이유정 (나)", host: true },
  { name: "윤아현", host: false },
  { name: "최찬욱", host: false },
  { name: "윤아현", host: false },
  { name: "조태수", host: false },
];

/* 불가능 카드에서 이름 칩을 최대 몇 개까지 노출할지 (나머지는 "+N") */
const MAX_BLOCKED_CHIPS = 6;

/**
 * "필수 참석자 일정 찾기" 화면.
 * 회의 생성 모달에서 날짜 선택 후 "다음"을 누르면 이 전체 화면으로 진입한다.
 * 좌측: 필수 참석자 검색·최근 목록 / 우측: 참석자별 가능·불가능 시간대.
 * 레이아웃·색상은 Figma(1440 프레임) 시안을 그대로 옮겼다.
 */
export default function RequiredAttendeesView({
  open,
  topic,
  startDate,
  onBack,
  onClose,
}: RequiredAttendeesViewProps) {
  // 선택된 필수 참석자 — 최초 진입 시 비어 있고, 좌측 목록에서 추가하면 채워진다.
  const [participants, setParticipants] = useState<string[]>([]);
  // 검색어 — 입력하면 검색 결과 시트가 뜬다.
  const [query, setQuery] = useState("");
  // 체크된 시간대 (기본은 표시된 가능 시간대 중 처음 2개)
  const [checkedHours, setCheckedHours] = useState<Set<number>>(() => new Set());
  // 현재 마우스가 올라간 시간대 행 — 삭제(trash) 아이콘 노출 제어 (CSS group-hover 대신 JS로 확실히 제어)
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  // 사용자가 trash로 삭제한 시간대 — 목록에서 제외
  const [deletedHours, setDeletedHours] = useState<Set<number>>(() => new Set());

  // 선택 참석자 + 날짜 → 시간대별 가능/불가능 계산
  const slots = useMemo(
    () => buildDaySlots(participants, startDate),
    [participants, startDate],
  );

  // 삭제한 시간대는 제외하고, 참석자가 1명일 땐 불가능 시간대는 숨김.
  // 그 외에는 가능 시간대를 위로, 불가능 시간대를 아래로 정렬(각 그룹 내 시간 순 유지).
  const visibleSlots = useMemo(() => {
    const shown = slots.filter(
      (slot) =>
        !deletedHours.has(slot.hour) &&
        (participants.length === 1 ? slot.blockedBy.length === 0 : true),
    );
    const available = shown.filter((slot) => slot.blockedBy.length === 0);
    const blocked = shown.filter((slot) => slot.blockedBy.length > 0);
    return [...available, ...blocked];
  }, [slots, participants.length, deletedHours]);

  // 기본 체크: 참석자/날짜가 바뀔 때 가능 시간대 중 처음 2개를 선택 상태로 초기화
  // (삭제로 인한 목록 변화에는 체크가 리셋되지 않도록 slots 기준으로만 초기화)
  useEffect(() => {
    const defaults = slots
      .filter((slot) => slot.blockedBy.length === 0)
      .slice(0, 2)
      .map((slot) => slot.hour);
    setCheckedHours(new Set(defaults));
  }, [slots]);

  function toggleHour(hour: number) {
    setCheckedHours((prev) => {
      const next = new Set(prev);
      if (next.has(hour)) next.delete(hour);
      else next.add(hour);
      return next;
    });
  }

  // trash 클릭 → 해당 시간대를 목록에서 삭제
  function deleteHour(hour: number) {
    setDeletedHours((prev) => new Set(prev).add(hour));
    setHoveredHour((h) => (h === hour ? null : h));
  }

  function addParticipant(name: string) {
    setParticipants((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }

  function removeParticipant(name: string) {
    setParticipants((prev) => prev.filter((n) => n !== name));
  }

  // 검색 결과 — 이미 추가한 참석자는 제외
  const q = query.trim();
  const results = q
    ? DIRECTORY.filter((n) => n.includes(q) && !participants.includes(n))
    : [];

  // Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const title = topic.trim() || "회의";

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-gradient-to-b from-white to-[#ffefe4]"
      onMouseMove={(e) => {
        // 화면 어디로 움직이든 커서 밑의 시간대 행을 다시 계산 → 커서를 떼면 trash가 확실히 사라짐
        const row = (e.target as HTMLElement).closest("[data-hour]");
        setHoveredHour(row ? Number((row as HTMLElement).dataset.hour) : null);
      }}
      onMouseLeave={() => setHoveredHour(null)}
    >
      <div className="mx-auto flex min-h-full w-[919px] flex-col px-2 py-[80px]">
        {/* ── 헤더 ── */}
        <div className="flex items-center gap-[8px] text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
          <span className="whitespace-nowrap">{title}</span>
          <span className="size-[6px] rounded-full bg-[#cfd4dd]" />
          <span className="whitespace-nowrap">{formatHeaderDate(startDate)}</span>
        </div>
        <h1 className="mt-[10px] text-[28px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
          필수 참석자 일정 찾기
        </h1>
        <p className="mt-[2px] text-[14px] font-semibold leading-[1.6] tracking-[-0.5px] text-[#ff6a60]">
          필수 참석자의 빈 시간을 찾아드려요. 일정이 확정되면 선택 참석자에게도 공유해요.
        </p>

        {/* ── 카드 2열 ── */}
        <div className="mt-[36px] flex gap-[28px]">
          {/* 좌측: 필수 참석자 검색 + 최근 목록 */}
          <div className="relative h-[628px] w-[399px] shrink-0 rounded-[36px] bg-white/90 px-[30px] pt-[41px] shadow-card">
            {/* 검색 바 */}
            <div className="flex h-[42px] items-center gap-[8px] rounded-[24px] bg-gray-100 pl-[18px] pr-[15px]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="필수 참석자를 검색해보세요"
                className="min-w-0 flex-1 bg-transparent text-[17px] font-medium leading-[1.6] tracking-[-0.5px] text-gray-1000 outline-none placeholder:text-gray-600"
              />
              <SearchIcon size={24} className="shrink-0 text-gray-600" />
            </div>

            {/* 검색 결과 시트 — 검색어가 있을 때 검색 바 아래에 떠서 표시 */}
            {results.length > 0 && (
              <div className="absolute inset-x-[30px] top-[97px] z-10 overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_40px_0px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-[8px] px-[27px] py-[23px]">
                  {results.map((name) => (
                    <div
                      key={name}
                      className="group flex items-center justify-between rounded-[12px] px-[18px] py-[2px] transition-colors hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-[11px]">
                        <span className="size-[36px] shrink-0 rounded-full bg-gray-600" />
                        <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
                          {name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addParticipant(name)}
                        className="flex h-[28px] w-[52px] items-center justify-center rounded-[12px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        추가
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 최근 라벨 */}
            <p className="mt-[20px] pl-[20px] text-[13px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-700">
              최근
            </p>

            {/* 목록 */}
            <div className="mt-[11px] flex flex-col gap-[17px]">
              {RECENT.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="group flex items-center justify-between rounded-[12px] px-[18px] py-[6px] transition-colors hover:bg-[#f7f8f9]"
                >
                  <div className="flex items-center gap-[11px]">
                    <span className="size-[36px] shrink-0 rounded-full bg-gray-600" />
                    <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
                      {p.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addParticipant(p.name)}
                    className="flex h-[28px] w-[52px] items-center justify-center rounded-[12px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    추가
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 참석자별 가능/불가능 시간대 */}
          <div className="flex h-[628px] w-[492px] shrink-0 flex-col overflow-hidden rounded-[36px] bg-white px-[32px] pt-[44px] shadow-card">
            {/* 참석 라벨 + 참석자 탭 */}
            <div className="flex flex-wrap items-center gap-[10px] pl-[3px]">
              <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                참석
              </span>
              {participants.map((n) => (
                <span
                  key={n}
                  className="flex h-[36px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-[6px] border border-gray-300 pl-[10px] pr-[7px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800"
                >
                  {n}
                  <button
                    type="button"
                    onClick={() => removeParticipant(n)}
                    aria-label={`${n} 삭제`}
                    className="shrink-0 text-gray-500 transition-colors hover:text-gray-800"
                  >
                    <CloseIcon size={14} />
                  </button>
                </span>
              ))}
            </div>

            {participants.length === 0 ? (
              /* 최초 진입 — 참석자 미선택 시 안내 문구 */
              <div className="flex flex-1 items-center justify-center pb-[44px]">
                <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.5px] text-gray-600">
                  참석자를 검색하면 빈 시간을 찾아드릴게요
                </p>
              </div>
            ) : (
            /* 시간대 목록 — 선택 참석자들의 실제 일정으로 계산.
               각 행 key에 불가능 인원 수를 섞어, 상태가 바뀐 행만 재마운트되며 펼침 애니메이션이 다시 재생된다. */
            <div className="mt-[20px] flex flex-1 flex-col gap-[9px] overflow-y-auto pb-[44px] pr-[4px]">
              {visibleSlots.map((slot, index) => {
                if (slot.blockedBy.length === 0) {
                  const isOn = checkedHours.has(slot.hour);
                  return (
                    <div
                      key={`${slot.hour}:${slot.blockedBy.length}`}
                      data-hour={slot.hour}
                      style={{ animationDelay: `${index * 45}ms` }}
                      className="animate-slot-unfold flex shrink-0 items-center gap-[12px]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleHour(slot.hour)}
                        aria-pressed={isOn}
                        className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] text-white transition-colors ${
                          isOn ? "bg-[#6373ff]" : "bg-[#d6e4ff]"
                        }`}
                      >
                        <CheckIcon size={18} />
                      </button>
                      <div className="flex flex-1 items-start rounded-[22px] bg-[#f5f6ff] px-[24px] py-[18px]">
                        <div className="flex flex-1 flex-col gap-[3px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#6373ff]">
                              모두 가능
                            </span>
                            <button
                              type="button"
                              aria-label="시간대 삭제"
                              onClick={() => deleteHour(slot.hour)}
                              className={`text-[#ff6a60] transition-opacity ${
                                hoveredHour === slot.hour ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <TrashIcon size={24} />
                            </button>
                          </div>
                          <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#6373ff]">
                            {slot.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                const shown = slot.blockedBy.slice(0, MAX_BLOCKED_CHIPS);
                const extra = slot.blockedBy.length - shown.length;
                const isOn = checkedHours.has(slot.hour);
                return (
                  <div
                    key={`${slot.hour}:${slot.blockedBy.length}`}
                    data-hour={slot.hour}
                    style={{ animationDelay: `${index * 45}ms` }}
                    className="animate-slot-unfold flex shrink-0 items-start gap-[12px]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleHour(slot.hour)}
                      aria-pressed={isOn}
                      className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition-colors ${
                        isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-transparent"
                      }`}
                    >
                      <CheckIcon size={18} />
                    </button>
                    <div className="flex flex-1 flex-col gap-[10px] rounded-[22px] border border-gray-400 px-[24px] py-[18px]">
                      <div className="flex flex-col gap-[3px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
                            불가능 {slot.blockedBy.length}명
                          </span>
                          <button
                            type="button"
                            aria-label="시간대 삭제"
                            onClick={() => deleteHour(slot.hour)}
                            className={`text-[#ff6a60] transition-opacity ${
                              hoveredHour === slot.hour ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <TrashIcon size={24} />
                          </button>
                        </div>
                        <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                          {slot.time}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-[10px]">
                        {shown.map((p, i) => (
                          <span
                            key={`${p.name}-${i}`}
                            title={p.title}
                            className="flex min-w-[71px] items-center justify-center rounded-[6px] border border-dashed border-[#ff8c8c] px-[8px] py-[6px] text-[14px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-800"
                          >
                            {p.name}
                          </span>
                        ))}
                        {extra > 0 && (
                          <span className="flex min-w-[71px] items-center justify-center rounded-[6px] border border-dashed border-[#ff8c8c] px-[8px] py-[6px] text-[14px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-600">
                            +{extra}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="mt-[29px] flex items-center justify-end gap-[18px]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[57px] w-[183px] items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-gray-800 transition-colors hover:brightness-95"
          >
            뒤로
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[57px] w-[232px] items-center justify-center gap-[8px] rounded-[18px] bg-carrot-600 text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-white transition-colors hover:brightness-95"
          >
            선택 날짜 초대 보내기
            <SendIcon size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
