import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, MonitorDown, X } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { getStreak, getTotalCheckins, computeBadges, sendNotification } from '@/utils/reports';
import GreetingCard from '@/components/GreetingCard';
import ProgressRing from '@/components/ProgressRing';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import DailyReportModal from '@/components/DailyReportModal';
import SettingsModal from '@/components/SettingsModal';
import DailyQuote from '@/components/DailyQuote';
import BadgeList from '@/components/BadgeList';
import DataManageModal from '@/components/DataManageModal';
import HistoryCalendar from '@/components/HistoryCalendar';

function InstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(ua);

    if (isMobile) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const ua2 = navigator.userAgent.toLowerCase();
  const isAndroid2 = /android/.test(ua2);

  const handleClick = () => {
    const msg = isAndroid2
      ? '📲 点击浏览器右上角菜单 ⋮\n→ 选择「安装应用」或「添加到主屏幕」'
      : '📲 点击浏览器底部 ⬆️ 分享按钮\n→ 找到「添加到主屏幕」\n→ 点击「添加」';
    alert(msg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] rounded-2xl px-4 py-3 mb-4 flex items-center justify-between text-white shadow-lg"
    >
      <div className="flex items-center gap-2">
        <MonitorDown size={18} />
        <span className="text-sm font-medium">安装到手机桌面，像App一样使用！</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          className="px-3 py-1.5 bg-white text-pink-500 rounded-lg text-xs font-bold hover:bg-pink-50 transition-colors active:scale-95"
        >
          如何安装
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { tasks, records, loadAll, getTodayCompletion, settings, setShowReport } = useCheckinStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const { rate, completed, total } = getTodayCompletion();
  const streak = getStreak(tasks, records);
  const totalCheckins = getTotalCheckins(records);
  const badges = computeBadges(tasks, records);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  useEffect(() => {
    const checkReport = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h === settings.reportHour && m === settings.reportMinute) {
        const today = new Date().toISOString().slice(0, 10);
        const lastShown = localStorage.getItem('checkin_last_report');
        if (lastShown !== today) {
          setShowReport(true);
          localStorage.setItem('checkin_last_report', today);
        }
      }
    };

    const checkReminder = () => {
      if (!settings.reminderEnabled) return;
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h === settings.reminderHour && m === settings.reminderMinute) {
        const today = new Date().toISOString().slice(0, 10);
        const lastReminder = localStorage.getItem('checkin_last_reminder');
        if (lastReminder !== today) {
          const { completed: c, total: t } = getTodayCompletion();
          if (c < t) {
            sendNotification('🌸 打卡提醒', `你还有 ${t - c} 个任务未完成，快来打卡吧！`);
            localStorage.setItem('checkin_last_reminder', today);
          }
        }
      }
    };

    const interval = setInterval(() => {
      checkReport();
      checkReminder();
    }, 30000);
    checkReport();
    checkReminder();
    return () => clearInterval(interval);
  }, [settings, setShowReport, getTodayCompletion]);

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <GreetingCard />
        <SettingsModal />
      </div>

      <InstallBanner />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="col-span-1 flex justify-center">
          <ProgressRing rate={rate} />
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-pink-50 flex-1 flex items-center justify-center">
            <div className="text-center">
              <Flame size={20} className="mx-auto text-amber-400 mb-0.5" />
              <p className="text-xl font-bold text-amber-500">{streak}</p>
              <p className="text-xs text-amber-400">连续打卡</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-pink-50 flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-xl">⭐</span>
              <p className="text-xl font-bold text-pink-500">{totalCheckins}</p>
              <p className="text-xs text-pink-400">总打卡数</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <DailyQuote />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setShowBadges(!showBadges)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-pink-500 text-xs font-medium shadow-sm border border-pink-50 hover:bg-pink-50 transition-colors active:scale-95 whitespace-nowrap"
        >
          🏅 成就 ({unlockedCount}/{badges.length})
        </button>
        <HistoryCalendar />
        <DataManageModal />
      </div>

      {showBadges && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 mb-5"
        >
          <BadgeList badges={badges} />
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-pink-800">
          今日任务
          <span className="ml-2 text-xs font-normal text-pink-400">
            {completed}/{total}
          </span>
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-400 text-white text-xs font-medium hover:bg-pink-500 transition-colors active:scale-95"
        >
          <Plus size={14} />
          添加
        </button>
      </div>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-gray-400 mb-4 text-sm">还没有任务，开始你的第一个打卡吧！</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2.5 rounded-xl bg-pink-400 text-white text-sm font-medium hover:bg-pink-500 transition-colors active:scale-95"
          >
            创建任务 ✨
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <TaskForm open={showAddForm} onClose={() => setShowAddForm(false)} />
      <DailyReportModal />
    </div>
  );
}