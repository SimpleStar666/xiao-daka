import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { getAllCategories } from '@/utils/reports';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import type { Task } from '@/types';

export default function TasksPage() {
  const { tasks, loadAll, deleteTask, customCategories } = useCheckinStore();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const allCategories = getAllCategories(customCategories);

  const filteredTasks = filterCategory === 'all'
    ? tasks
    : tasks.filter((t) => t.category === filterCategory);

  const shortTasks = filteredTasks.filter((t) => t.type === 'short');
  const longTasks = filteredTasks.filter((t) => t.type === 'long');

  const handleEdit = (task: Task) => {
    setEditTarget(task);
    setShowForm(true);
  };

  const handleDelete = (task: Task) => {
    deleteTask(task.id);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-pink-800">任务管理</h1>
          <p className="text-sm text-pink-400 mt-0.5">管理你的所有打卡任务</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-400 text-white text-xs font-medium hover:bg-pink-500 transition-colors active:scale-95"
        >
          <Plus size={14} />
          添加
        </button>
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-pink-400 text-white shadow-sm'
              : 'bg-white text-gray-400 border border-pink-50'
          }`}
        >
          全部
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              filterCategory === cat.id
                ? 'text-white shadow-sm'
                : 'bg-white text-gray-400 border border-pink-50'
            }`}
            style={filterCategory === cat.id ? { backgroundColor: cat.color } : undefined}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-400 mb-4 text-sm">还没有任务哦</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 rounded-xl bg-pink-400 text-white text-sm font-medium hover:bg-pink-500 transition-colors"
          >
            创建第一个任务 ✨
          </button>
        </motion.div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <p className="text-3xl mb-2">🔍</p>
          <p>该分类下没有任务</p>
        </div>
      ) : (
        <div className="space-y-5">
          {shortTasks.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-amber-500 mb-2 flex items-center gap-1.5">
                <span>⏰</span> 短期目标 ({shortTasks.length})
              </h2>
              <motion.div layout className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {shortTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      showActions
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {longTasks.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-sky-500 mb-2 flex items-center gap-1.5">
                <span>🎯</span> 长期目标 ({longTasks.length})
              </h2>
              <motion.div layout className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {longTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      showActions
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      )}

      <TaskForm open={showForm} onClose={handleClose} editTask={editTarget} />
    </div>
  );
}