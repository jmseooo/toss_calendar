"use client";

import { useEffect, type RefObject } from "react";

/** 한 칸 넘기는 데 필요한 휠 누적량. 마우스 휠 한 칸(deltaY 100)이면 바로 넘어간다. */
const WHEEL_THRESHOLD = 100;
/** 넘긴 뒤 이만큼은 휠을 무시한다. 트랙패드 관성으로 여러 칸 건너뛰는 걸 막는다. */
const WHEEL_COOLDOWN_MS = 400;

/** 세로로 스크롤할 여지가 남은 가장 가까운 조상. 없으면 null */
function scrollableParent(node: HTMLElement): HTMLElement | null {
  for (let el = node.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    const scrollable = overflowY === "auto" || overflowY === "scroll";
    if (scrollable && el.scrollHeight > el.clientHeight) return el;
  }
  return null;
}

/**
 * 휠(트랙패드 포함)로 이전/다음 구간을 넘기는 훅. 월간은 달 단위, 주간은 주 단위로 쓴다.
 *
 * 캘린더가 화면보다 길면 세로 스크롤이 우선이고, 위/아래 끝에 닿은 뒤 한 번 더
 * 굴려야 넘어간다. 무조건 가로채면 아래쪽 내용을 영영 볼 수 없기 때문이다.
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
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // 가로 스와이프는 무시

      // 아직 스크롤할 여지가 있으면 브라우저에 맡긴다.
      const scroller = scrollableParent(root);
      if (scroller) {
        const atTop = scroller.scrollTop <= 0;
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >=
          scroller.scrollHeight - 1;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          accumulated = 0;
          return;
        }
      }

      e.preventDefault(); // 끝에 닿았으니 스크롤 대신 이동으로 쓴다
      if (cooldown) {
        accumulated = 0; // 관성으로 밀려드는 이벤트가 다음 이동에 쌓이지 않게
        return;
      }

      accumulated += e.deltaY;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      if (accumulated > 0) onNext();
      else onPrev();

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
