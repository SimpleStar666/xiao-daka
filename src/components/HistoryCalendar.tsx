import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { getMonthDays, getDailySummary } from '@/utils/reports';

export default function HistoryCalendar() {
  const { tasks, records } = useCheckinStore();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const days = getMonthDays(viewDate.year, viewDate.month);

  const getColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100 text-gray-300';
    if (rate < 30) return 'bg-red-200 text-white';
    if (rate < 60) return 'bg-amber-200 text-white';
    if (rate < 90) return 'bg-green-200 text-white';
    return 'bg-green-400 text-white';
  };

  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();

  const prevMonth = () => {
    setViewDate((d) => {
      const m = d.month === 0 ? 11 : d.month - 1;
      const y = d.month === 0 ? d.year - 1 : d.year;
      return { year: y, month: m };
    });
  };

  const nextMonth = () => {
    const now = new Date();
    if (viewDate.year === now.getFullYear() && viewDate.month === now.getMonth()) return;
    setViewDate((d) => {
      const m = d.month === 11 ? 0 : d.month + 1;
      const y = d.month === 11 ? d.year + 1 : d.year;
      return { year: y, month: m };
    });
  };

  const monthLabel = `${viewDate.year}年${viewDate.month + 1}月`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-pink-500 text-xs font-medium shadow-sm border border-pink-50 hover:bg-pink-50 transition-colors active:scale-95"
      >
        📅 历史日历
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-pink-50 text-pink-400">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-base font-bold text-pink-800">{monthLabel}</h2>
                <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-pink-50 text-pink-400">
                  <ChevronRight size={18} />
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-xl hover:bg-pink-50 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
                  <div key={d} className="text-center text-xs text-pink-300 font-medium py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((date) => {
                  const summary = getDailySummary(date, tasks, records);
                  const day = parseInt(date.slice(8), 10);
                  return (
                    <div
                      key={date}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${getColor(summary.rate)}`}
                      title={`${date}: ${summary.rate}%`}
                    >
                      {day}
                    </div>
                  );
                })}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}