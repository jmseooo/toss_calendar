import Sidebar from "@/components/Sidebar";
import CalendarToolbar from "@/components/CalendarToolbar";
import MonthGrid from "@/components/MonthGrid";
import AgendaPanel from "@/components/AgendaPanel";

export default function Home() {
  return (
    // 데스크톱(xl 이상): 사이드바 | 캘린더 | 아젠다 3열, 화면 고정
    // 그 이하: 세로 스크롤, 아젠다는 캘린더 아래로 스택
    <div className="flex min-h-screen w-full xl:h-screen xl:overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
        {/* 가운데: 툴바 + 월간 캘린더 */}
        <main className="flex min-w-0 flex-1 flex-col gap-[19px] px-4 py-6 sm:px-6 xl:px-[37px] xl:py-[24px]">
          <CalendarToolbar />
          <MonthGrid />
        </main>

        {/* 우측(또는 아래): 아젠다 */}
        <div className="shrink-0 px-4 pb-6 sm:px-6 xl:min-h-0 xl:overflow-y-auto xl:py-[24px] xl:pl-0 xl:pr-[42px]">
          <AgendaPanel />
        </div>
      </div>
    </div>
  );
}
