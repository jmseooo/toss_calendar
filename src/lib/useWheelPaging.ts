"use client";

import { useEffect, type RefObject } from "react";

/** 한 칸 넘기는 데 필요한 휠 누적량. 트랙패드 가로 스와이프 한 번이면 넘어간다. */
const WHEEL_THRESHOLD = 100;
/** 넘긴 뒤 이만큼은 휠을 무시한다. 트랙패드 관성으로 여러 칸 건너뛰는 걸 막는다. */
const WHEEL_COOLDOWN_MS = 400;

/**
 * 좌우 스크롤(트랙패드 가로 스와이프, Shift+휠)로 이전/다음 구간을 넘기는 훅.
 * 월간은 달 단위, 주간은 주 단위로 쓴다.
 *
 * 세로 휠은 건드리지 않는다 — 캘린더가 화면보다 길면 평소대로 세로 스크롤된다.
 * 왼쪽으로 밀면 이전, 오른쪽으로 밀면 다음.
 *
 * onPrev/onNext 는 참조가 안정적이어야 한다(useCallback). 매 렌더 새 함수면
 * 리스너가 재등록되며 휠 누적량과 쿨다운이 초기화된다.
 */
export function useWheelPaging(
  ref: RefObject<HTMLElement | null>,
  onPrev: () => void,
  onNext: () => void,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let accumulated = 0;
    let cooldown = false;
    let timer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // 세로 스크롤 의도는 그대로 둔다

      e.preventDefault(); // 가로 스와이프는 페이지 가로 스크롤 대신 구간 이동으로 쓴다
      if (cooldown) {
        accumulated = 0; // 관성으로 밀려드는 이벤트가 다음 이동에 쌓이지 않게
        return;
      }

      accumulated += e.deltaX;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      if (accumulated > 0) onNext(); // 오른쪽으로 밀면 다음
      else onPrev(); // 왼쪽으로 밀면 이전

      accumulated = 0;
      cooldown = true;
      timer = setTimeout(() => {
        cooldown = false;
      }, WHEEL_COOLDOWN_MS);
    };

    // React의 onWheel은 passive라 preventDefault가 먹지 않는다. 직접 등록한다.
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      clearTimeout(timer);
    };
  }, [ref, onPrev, onNext]);
}
