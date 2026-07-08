import Sidebar from "@/components/Sidebar";
import CalendarToolbar from "@/components/CalendarToolbar";
import CalendarView from "@/components/CalendarView";
import AgendaPanel from "@/components/AgendaPanel";
import { DayViewProvider } from "@/components/DayViewContext";
import { MonthViewProvider } from "@/components/MonthViewContext";
import { WeekViewProvider } from "@/components/WeekViewContext";
import { ViewModeProvider } from "@/components/ViewModeContext";

export default function Home() {
  return (
    // 사이드바 | 캘린더 | 일별 캘린더(아젠다) 3열을 항상 나란히 유지.
    // 가로폭이 줄면 캘린더가 함께 줄어들고, 일별 캘린더는 늘 우측에 같이 표시된다.
    <ViewModeProvider>
      <MonthViewProvider>
        <WeekViewProvider>
          <DayViewProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <Sidebar />

              <div className="flex min-w-0 flex-1 flex-row">
                {/* 가운데: 툴바 + 캘린더(월간/주간 전환) — 가로폭에 따라 함께 축소 */}
                <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-[19px] overflow-y-auto px-3 py-6 sm:px-6 xl:px-[37px] xl:py-[24px]">
                  <CalendarToolbar />
                  <CalendarView />
                </main>

                {/* 우측: 일별 캘린더(아젠다) — 항상 캘린더 옆에 표시 */}
                <div className="min-h-0 shrink-0 overflow-y-auto px-3 py-6 sm:px-4 xl:py-[24px] xl:pl-0 xl:pr-[42px]">
                  <AgendaPanel />
                </div>
              </div>
            </div>
          </DayViewProvider>
        </WeekViewProvider>
      </MonthViewProvider>
    </ViewModeProvider>
  );
}
