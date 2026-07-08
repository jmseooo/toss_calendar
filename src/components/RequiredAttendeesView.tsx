"use client";

import { useEffect, useState } from "react";
import { WEEKDAYS } from "@/lib/calendar";
import { CheckIcon, SearchIcon, SendIcon, TrashIcon } from "./icons";

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

/* 검색 대상 전체 명단 (Figma 시안 기준 목업 데이터) */
const DIRECTORY = ["이유정 (나)", "윤아현", "최찬욱", "조태수", "서현정", "조민아"];

/* 좌측 카드 — 최근 필수 참석자 목록 (Figma 시안 기준 목업 데이터) */
const RECENT = [
  { name: "이유정 (나)", host: true },
  { name: "윤아현", host: false },
  { name: "최찬욱", host: false },
  { name: "윤아현", host: false },
  { name: "조태수", host: false },
];

/* 우측 카드 — 시간대 후보 (Figma 시안 기준 목업 데이터) */
type Slot =
  | { id: string; kind: "available"; time: string }
  | { id: string; kind: "blocked"; time: string; names: string[] };

const SLOTS: Slot[] = [
  { id: "s1", kind: "available", time: "11:00~12:00" },
  { id: "s2", kind: "available", time: "13:00~14:00" },
  { id: "s3", kind: "blocked", time: "13:00~14:00", names: ["서현정", "조민아", "윤아"] },
  { id: "s4", kind: "blocked", time: "19:00~20:00", names: ["서현정", "조민아", "윤아"] },
];

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
  // "모두 가능" 슬롯의 체크 상태 (기본 모두 선택)
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of SLOTS) if (s.kind === "available") init[s.id] = true;
    return init;
  });

  // 선택된 필수 참석자 — 최초 진입 시 비어 있고, 좌측 목록에서 추가하면 채워진다.
  const [participants, setParticipants] = useState<string[]>([]);
  // 검색어 — 입력하면 검색 결과 시트가 뜬다.
  const [query, setQuery] = useState("");

  function addParticipant(name: string) {
    setParticipants((prev) => (prev.includes(name) ? prev : [...prev, name]));
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
    <div className="fixed inset-0 z-50 overflow-auto bg-gradient-to-b from-white to-[#ffefe4]">
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
        <div className="mt-[46px] flex gap-[28px]">
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
              <div className="absolute inset-x-[30px] top-[97px] z-10 overflow-hidden rounded-[20px] bg-white/[0.92] shadow-[0px_2px_40px_0px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-[8px] px-[27px] py-[23px]">
                  {results.map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between px-[18px]"
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
                        className="flex h-[28px] w-[52px] items-center justify-center rounded-[12px] bg-white text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600 transition-colors hover:bg-gray-100"
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
                <button
                  key={`${p.name}-${i}`}
                  type="button"
                  onClick={() => addParticipant(p.name)}
                  className="flex items-center justify-between rounded-[12px] px-[18px] py-[2px] transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center gap-[11px]">
                    <span className="size-[36px] shrink-0 rounded-full bg-gray-600" />
                    <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.5px] text-black">
                      {p.name}
                    </span>
                  </div>
                  {p.host && (
                    <span className="flex h-[28px] w-[52px] items-center justify-center rounded-[12px] bg-white text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-carrot-600">
                      주최
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 우측: 참석자별 가능/불가능 시간대 */}
          <div className="flex h-[628px] w-[492px] shrink-0 flex-col overflow-hidden rounded-[36px] bg-white px-[32px] pt-[44px] shadow-card">
            {/* 참석 라벨 + 참석자 탭 */}
            <div className="flex items-center gap-[10px] pl-[3px]">
              <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-700">
                참석
              </span>
              {participants.map((n) => (
                <span
                  key={n}
                  className="flex h-[36px] items-center justify-center rounded-[6px] border border-gray-300 px-[10px] text-[16px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800"
                >
                  {n}
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
            /* 시간대 목록 */
            <div className="mt-[20px] flex flex-col gap-[9px]">
              {SLOTS.map((slot) => {
                if (slot.kind === "available") {
                  const isOn = checked[slot.id];
                  return (
                    <div key={slot.id} className="group flex items-center gap-[12px]">
                      <button
                        type="button"
                        onClick={() =>
                          setChecked((c) => ({ ...c, [slot.id]: !c[slot.id] }))
                        }
                        aria-pressed={isOn}
                        className={`flex size-[33px] shrink-0 items-center justify-center rounded-[8px] transition-colors ${
                          isOn ? "bg-[#6373ff] text-white" : "bg-gray-200 text-transparent"
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
                              className="text-[#ff6a60] opacity-0 transition-opacity group-hover:opacity-100"
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
                return (
                  <div key={slot.id} className="flex items-center gap-[12px]">
                    <span className="flex size-[33px] shrink-0 items-center justify-center rounded-[8px] bg-gray-200 text-gray-600">
                      <CheckIcon size={18} />
                    </span>
                    <div className="flex flex-1 flex-col gap-[10px] rounded-[22px] border border-gray-400 px-[24px] py-[18px]">
                      <div className="flex flex-col gap-[3px]">
                        <span className="text-[13px] font-semibold leading-[1.3] tracking-[-0.5px] text-gray-800">
                          불가능 {slot.names.length}명
                        </span>
                        <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.5px] text-black">
                          {slot.time}
                        </span>
                      </div>
                      <div className="flex gap-[10px]">
                        {slot.names.map((n, i) => (
                          <span
                            key={`${n}-${i}`}
                            className="flex w-[71px] items-center justify-center rounded-[6px] border border-dashed border-[#ff8c8c] px-[4px] py-[6px] text-[14px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-800"
                          >
                            {n}
                          </span>
                        ))}
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
