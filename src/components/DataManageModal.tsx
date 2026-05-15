import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, AlertCircle } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { exportData, importData } from '@/utils/reports';

export default function DataManageModal() {
  const { tasks, records, settings, customCategories, importAll } = useCheckinStore();
  const [open, setOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    exportData(tasks, records, settings, customCategories);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = importData(ev.target?.result as string);
        if (result) {
          importAll(result.tasks, result.records, result.settings, result.customCategories);
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 2000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 2000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-pink-500 text-xs font-medium shadow-sm border border-pink-50 hover:bg-pink-50 transition-colors active:scale-95"
      >
        <Download size={14} />
        数据管理
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
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-pink-800">数据管理</h2>
                <button onClick={() => setOpen(false)} className="p-1 rounded-xl hover:bg-pink-50 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-400 flex items-center justify-center text-white">
                    <Download size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-pink-800">导出数据</p>
                    <p className="text-xs text-pink-400">将所有数据保存为 JSON 文件</p>
                  </div>
                </button>

                <button
                  onClick={handleImport}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-white">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">导入数据</p>
                    <p className="text-xs text-amber-400">从 JSON 备份文件恢复数据</p>
                  </div>
                </button>
              </div>

              {importStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center"
                >
                  ✅ 导入成功！
                </motion.div>
              )}

              {importStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-50 text-red-500 text-sm text-center flex items-center justify-center gap-1"
                >
                  <AlertCircle size={14} />
                  导入失败，请检查文件格式
                </motion.div>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                数据存储在浏览器本地，清除浏览器数据会导致丢失
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}