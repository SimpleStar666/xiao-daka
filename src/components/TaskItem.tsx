import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';
import type { Task } from '@/types';
import { useCheckinStore } from '@/stores/checkinStore';
import { todayStr, getCategoryInfo } from '@/utils/reports';

interface TaskItemProps {
  task: Task;
  showActions?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskItem({ task, showActions, onEdit, onDelete }: TaskItemProps) {
  const { records, toggleCheckIn, customCategories } = useCheckinStore();
  const today = todayStr();
  const record = records.find((r) => r.taskId === task.id && r.date === today);
  const completed = record?.completed ?? false;
  const catInfo = getCategoryInfo(task.category, customCategories);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
        completed ? 'bg-pink-50/60' : 'bg-white'
      } shadow-sm hover:shadow-md border border-pink-50`}
    >
      <button
        onClick={() => toggleCheckIn(task.id)}
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          completed
            ? 'bg-pink-400 text-white shadow-sm'
            : 'border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50'
        }`}
      >
        {completed && <Check size={14} strokeWidth={3} />}
      </button>

      <span className="text-xl flex-shrink-0">{task.emoji}</span>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? 'text-pink-300 line-through' : 'text-gray-700'}`}>
          {task.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${task.type === 'short' ? 'text-amber-500' : 'text-sky-500'}`}>
            {task.type === 'short' ? '短期' : '长期'}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: catInfo.color + '60', color: '#666' }}
          >
            {catInfo.emoji} {catInfo.label}
          </span>
        </div>
      </div>

      <button
        onClick={() => toggleCheckIn(task.id)}
        className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
          completed
            ? 'bg-pink-100 text-pink-500'
            : 'bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] text-white shadow-sm'
        }`}
      >
        <CheckCircle2 size={16} className="inline-block -mt-0.5 mr-0.5" />
        {completed ? '已打卡' : '打卡'}
      </button>

      {showActions && onEdit && onDelete && (
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="px-2.5 py-1 text-xs rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(task)}
            className="px-2.5 py-1 text-xs rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
          >
            删除
          </button>
        </div>
      )}
    </motion.div>
  );
}