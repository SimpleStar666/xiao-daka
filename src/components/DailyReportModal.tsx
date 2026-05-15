import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { todayStr, getDailySummary } from '@/utils/reports';

export default function DailyReportModal() {
  const { tasks, records, showReport, setShowReport } = useCheckinStore();
  const today = todayStr();
  const summary = getDailySummary(today, tasks, records);

  const encouragement = () => {
    if (summary.rate === 100) return { text: '太棒了！今天全部完成！你是最棒的！', emoji: '🎉' };
    if (summary.rate >= 70) return { text: '做得不错！明天继续加油哦～', emoji: '💪' };
    if (summary.rate >= 40) return { text: '还有进步空间，明天再努力一点！', emoji: '🌸' };
    if (summary.rate > 0) return { text: '开始了就是好的，慢慢来～', emoji: '🌱' };
    return { text: '今天还没开始呢，现在开始也不晚！', emoji: '⏰' };
  };

  const enc = encouragement();

  return (
    <AnimatePresence>
      {showReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowReport(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-300 via-amber-200 to-pink-300" />

            <button
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4 p-1 rounded-xl hover:bg-pink-50 text-gray-400"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5 mt-2">
              <span className="text-4xl">{enc.emoji}</span>
              <h2 className="text-lg font-bold text-pink-800 mt-2">今日日报</h2>
              <p className="text-sm text-pink-400">{today}</p>
            </div>

            <div className="bg-pink-50 rounded-2xl p-4 mb-4 text-center">
              <div className="text-3xl font-bold text-pink-500">{summary.rate}%</div>
              <p className="text-xs text-pink-400 mt-1">
                完成 {summary.completed}/{summary.total} 项任务
              </p>
            </div>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {summary.tasks.map(({ task, completed }) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-2 text-sm py-1.5 px-3 rounded-xl ${
                    completed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'
                  }`}
                >
                  <span>{task.emoji}</span>
                  <span className="flex-1 truncate">{task.name}</span>
                  <span>{completed ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-pink-100 to-amber-50 rounded-2xl p-4 text-center">
              <Sparkles size={16} className="inline text-pink-400 mr-1" />
              <span className="text-sm text-pink-700 font-medium">{enc.text}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}