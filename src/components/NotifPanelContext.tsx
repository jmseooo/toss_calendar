"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

/**
 * 알림 패널이 열려 있는지 공유한다.
 * 열리면 우측 일별(아젠다) 캘린더를 접어 가운데 캘린더에 자리를 내주고,
 * 닫히면 다시 표시한다. Sidebar 가 상태를 쓰고, AgendaColumn 이 읽는다.
 */
interface NotifPanelValue {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NotifPanelContext = createContext<NotifPanelValue | null>(null);

export function NotifPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <NotifPanelContext.Provider value={value}>
      {children}
    </NotifPanelContext.Provider>
  );
}

export function useNotifPanel() {
  const ctx = useContext(NotifPanelContext);
  if (!ctx) throw new Error("useNotifPanel must be used within NotifPanelProvider");
  return ctx;
}
