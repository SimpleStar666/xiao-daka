import { useMemo } from 'react';
import { useCheckinStore } from '@/stores/checkinStore';
import { getMonthDays, getDailySummary } from '@/utils/reports';

export default function MonthlyReport() {
  const { tasks, records } = useCheckinStore();
  const days = getMonthDays();

  const dayData = useMemo(() => {
    return days.map((date) => {
      const summary = getDailySummary(date, tasks, records);
      return {
        date,
        day: parseInt(date.slice(8), 10),
        rate: summary.rate,
      };
    });
  }, [days, tasks, records]);

  const getColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100';
    if (rate < 30) return 'bg-red-200';
    if (rate < 60) return 'bg-amber-200';
    if (rate < 90) return 'bg-green-200';
    return 'bg-green-400';
  };

  const firstDayOfWeek = new Date(days[0]).getDay();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
      <h3 className="text-base font-bold text-pink-800 mb-4">📅 本月打卡热力图</h3>
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          <p className="text-3xl mb-2">📝</p>
          <p>还没有任务哦，先去添加一个吧</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-xs text-pink-300 font-medium py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {dayData.map((d) => (
              <div
                key={d.date}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getColor(d.rate)} ${
                  d.rate > 0 ? 'text-white' : 'text-gray-300'
                }`}
                title={`${d.date}: ${d.rate}%`}
              >
                {d.day}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
            <span>少</span>
            <div className="w-3 h-3 rounded bg-gray-100" />
            <div className="w-3 h-3 rounded bg-red-200" />
            <div className="w-3 h-3 rounded bg-amber-200" />
            <div className="w-3 h-3 rounded bg-green-200" />
            <div className="w-3 h-3 rounded bg-green-400" />
            <span>多</span>
          </div>
        </>
      )}
    </div>
  );
}