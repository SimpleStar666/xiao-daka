import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCheckinStore } from '@/stores/checkinStore';
import WeeklyReport from '@/components/WeeklyReport';
import MonthlyReport from '@/components/MonthlyReport';
import YearlyReport from '@/components/YearlyReport';
import type { ReportType } from '@/types';

const tabs: { key: ReportType; label: string; emoji: string }[] = [
  { key: 'weekly', label: '周报', emoji: '📊' },
  { key: 'monthly', label: '月报', emoji: '📅' },
  { key: 'yearly', label: '年报', emoji: '📈' },
];

export default function ReportsPage() {
  const { loadAll } = useCheckinStore();
  const [activeTab, setActiveTab] = useState<ReportType>('weekly');

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="pb-24">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-pink-800">数据报表</h1>
        <p className="text-sm text-pink-400 mt-0.5">看看你的打卡成果吧</p>
      </div>

      <div className="flex bg-pink-50 rounded-2xl p-1 mb-5">
        {tabs.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-pink-300 hover:text-pink-400'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'weekly' && <WeeklyReport />}
        {activeTab === 'monthly' && <MonthlyReport />}
        {activeTab === 'yearly' && <YearlyReport />}
      </motion.div>
    </div>
  );
}