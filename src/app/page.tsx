import Sidebar from "@/components/Sidebar";
import CalendarToolbar from "@/components/CalendarToolbar";
import CalendarView from "@/components/CalendarView";
import AgendaPanel from "@/components/AgendaPanel";
import { DayViewProvider } from "@/components/DayViewContext";
import { MonthViewProvider } from "@/components/MonthViewContext";
import { WeekViewProvider } from "@/components/WeekViewContext";
import { ViewModeProvider } from "@/components/ViewModeContext";
import { InviteProvider } from "@/components/InviteContext";

export default function Home() {
  return (
    // 사이드바 | 캘린더 | 일별 캘린더(아젠다) 3열을 항상 나란히 유지.
    // 가로폭이 줄면 캘린더가 함께 줄어들고, 일별 캘린더는 늘 우측에 같이 표시된다.
    <ViewModeProvider>
      <MonthViewProvider>
        <WeekViewProvider>
          <DayViewProvider>
            <InviteProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <Sidebar />

              <div className="flex min-w-0 flex-1 flex-row">
                {/* 가운데: 툴바 + 캘린더(월간/주간 전환) — 가로폭에 따라 함께 축소 */}
                <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-[19px] overflow-y-auto px-3 py-6 sm:px-6 xl:px-[37px] xl:py-[24px]">
                  <CalendarToolbar />
                  <CalendarView />
                </main>

                {/* 우측: 일별 캘린더(아젠다) — 항상 캘린더 옆에 표시.
                    scrollbar-gutter:stable — 고른 날짜의 일정 개수에 따라 세로 스크롤바가
                    생겼다 사라지면 이 컬럼 폭이 스크롤바만큼 바뀌고, 그만큼 가운데 캘린더가
                    좁아졌다 넓어진다. 스크롤바 자리를 늘 비워둬 가로폭을 일정하게 유지한다. */}
                <div className="min-h-0 shrink-0 overflow-y-auto [scrollbar-gutter:stable] px-3 py-6 sm:px-4 xl:py-[24px] xl:pl-0 xl:pr-[42px]">
                  <AgendaPanel />
                </div>
              </div>
            </div>
            </InviteProvider>
          </DayViewProvider>
        </WeekViewProvider>
      </MonthViewProvider>
    </ViewModeProvider>
  );
}
