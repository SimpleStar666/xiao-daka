import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import type { Task } from '@/types';
import { useCheckinStore } from '@/stores/checkinStore';
import { TASK_EMOJIS, TASK_COLORS, getAllCategories } from '@/utils/reports';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

export default function TaskForm({ open, onClose, editTask }: TaskFormProps) {
  const { addTask, updateTask, customCategories, addCustomCategory } = useCheckinStore();
  const [name, setName] = useState(editTask?.name ?? '');
  const [type, setType] = useState<'short' | 'long'>(editTask?.type ?? 'short');
  const [emoji, setEmoji] = useState(editTask?.emoji ?? TASK_EMOJIS[0]);
  const [color, setColor] = useState(editTask?.color ?? TASK_COLORS[0]);
  const [category, setCategory] = useState(editTask?.category ?? 'other');
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🏷️');
  const [newCatColor, setNewCatColor] = useState('#F3B0C3');

  const allCategories = getAllCategories(customCategories);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editTask) {
      updateTask(editTask.id, { name: name.trim(), type, emoji, color, category });
    } else {
      addTask(name.trim(), type, emoji, color, category);
    }
    setName('');
    setType('short');
    setEmoji(TASK_EMOJIS[0]);
    setColor(TASK_COLORS[0]);
    setCategory('other');
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    addCustomCategory(newCatLabel.trim(), newCatEmoji, newCatColor);
    setNewCatLabel('');
    setNewCatEmoji('🏷️');
    setNewCatColor('#F3B0C3');
    setShowNewCat(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-20 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-pink-800">
                {editTask ? '编辑任务' : '添加新任务'}
              </h2>
              <button onClick={onClose} className="p-1 rounded-xl hover:bg-pink-50 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="比如：每天阅读30分钟"
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">任务类型</label>
                <div className="flex gap-2">
                  {(['short', 'long'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        type === t
                          ? t === 'short'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {t === 'short' ? '短期目标' : '长期目标'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">分类标签</label>
                <div className="flex gap-1.5 flex-wrap">
                  {allCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        category === cat.id
                          ? 'text-white shadow-sm'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                      style={category === cat.id ? { backgroundColor: cat.color } : undefined}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowNewCat(!showNewCat)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-pink-50 text-pink-400 hover:bg-pink-100 transition-all flex items-center gap-0.5"
                  >
                    <Plus size={12} /> 自定义
                  </button>
                </div>

                <AnimatePresence>
                  {showNewCat && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 rounded-xl bg-pink-50/50 border border-pink-100 space-y-3"
                    >
                      <div className="flex gap-2">
                        <div className="w-16">
                          <label className="block text-[10px] text-gray-400 mb-1">图标</label>
                          <input
                            type="text"
                            value={newCatEmoji}
                            onChange={(e) => setNewCatEmoji(e.target.value)}
                            className="w-full px-2 py-2 rounded-lg border border-pink-100 bg-white text-center text-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
                            maxLength={2}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-gray-400 mb-1">标签名称</label>
                          <input
                            type="text"
                            value={newCatLabel}
                            onChange={(e) => setNewCatLabel(e.target.value)}
                            placeholder="输入标签名"
                            className="w-full px-3 py-2 rounded-lg border border-pink-100 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-300"
                            maxLength={10}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">颜色</label>
                        <div className="flex gap-1.5">
                          {TASK_COLORS.slice(0, 6).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewCatColor(c)}
                              className={`w-6 h-6 rounded-full transition-all ${
                                newCatColor === c ? 'scale-125 ring-2 ring-offset-1 ring-pink-300' : ''
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={!newCatLabel.trim()}
                        className="w-full py-2 rounded-lg bg-pink-400 text-white text-xs font-medium hover:bg-pink-500 disabled:opacity-40 transition-all"
                      >
                        添加标签
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">选择图标</label>
                <div className="grid grid-cols-8 gap-1.5 max-h-36 overflow-y-auto">
                  {TASK_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-all ${
                        emoji === e ? 'bg-pink-100 scale-110 shadow-sm' : 'hover:bg-pink-50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">主题色</label>
                <div className="flex gap-2 flex-wrap">
                  {TASK_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-pink-300' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-pink-400 text-white font-semibold text-sm hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {editTask ? '保存修改' : '添加任务 ✨'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}