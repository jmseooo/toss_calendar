import Sidebar from "@/components/Sidebar";
import CalendarToolbar from "@/components/CalendarToolbar";
import CalendarView from "@/components/CalendarView";
import AgendaColumn from "@/components/AgendaColumn";
import { DayViewProvider } from "@/components/DayViewContext";
import { MonthViewProvider } from "@/components/MonthViewContext";
import { WeekViewProvider } from "@/components/WeekViewContext";
import { ViewModeProvider } from "@/components/ViewModeContext";
import { InviteProvider } from "@/components/InviteContext";
import { NotifPanelProvider } from "@/components/NotifPanelContext";
import { TodayProvider } from "@/components/TodayContext";

export default function Home() {
  return (
    // 사이드바 | 캘린더 | 일별 캘린더(아젠다) 3열을 항상 나란히 유지.
    // 가로폭이 줄면 캘린더가 함께 줄어들고, 일별 캘린더는 늘 우측에 같이 표시된다.
    <TodayProvider>
    <ViewModeProvider>
      <MonthViewProvider>
        <WeekViewProvider>
          <DayViewProvider>
            <InviteProvider>
            <NotifPanelProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <Sidebar />

              {/* lg 이상: 캘린더 | 일별 캘린더 나란히(각자 스크롤).
                  lg 미만: 세로로 쌓여 일별 캘린더가 캘린더 아래로 내려가고 전체가 스크롤된다. */}
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
                {/* 가운데: 툴바 + 캘린더(월간/주간 전환) — 가로폭에 따라 크기가 함께 축소 */}
                <main className="flex min-w-0 flex-col gap-[19px] px-3 py-6 sm:px-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto xl:px-[37px] xl:py-[24px]">
                  <CalendarToolbar />
                  <CalendarView />
                </main>

                {/* 우측(넓을 때) / 아래(좁을 때): 일별 캘린더(아젠다).
                    알림 패널이 열리면 접히고 닫히면 다시 나타난다. */}
                <AgendaColumn />
              </div>
            </div>
            </NotifPanelProvider>
            </InviteProvider>
          </DayViewProvider>
        </WeekViewProvider>
      </MonthViewProvider>
    </ViewModeProvider>
    </TodayProvider>
  );
}
