"use client";

import AgendaPanel from "./AgendaPanel";
import { useNotifPanel } from "./NotifPanelContext";

/**
 * 우측 일별(아젠다) 캘린더 컬럼.
 * 알림 패널이 열리면 접히고(가운데 캘린더가 넓어짐), 닫히면 다시 나타난다.
 */
export default function AgendaColumn() {
  const { open } = useNotifPanel();
  if (open) return null;

  return (
    <div className="w-full shrink-0 px-3 py-6 sm:px-4 lg:min-h-0 lg:w-auto lg:overflow-y-auto lg:[scrollbar-gutter:stable] xl:py-[24px] xl:pl-0 xl:pr-[42px]">
      <AgendaPanel />
    </div>
  );
}
