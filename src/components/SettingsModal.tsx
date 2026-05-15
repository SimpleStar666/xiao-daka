import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Bell, BellOff } from 'lucide-react';
import { useCheckinStore } from '@/stores/checkinStore';
import { requestNotificationPermission } from '@/utils/reports';

export default function SettingsModal() {
  const { settings, updateSettings } = useCheckinStore();
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState(settings.nickname);
  const [hour, setHour] = useState(settings.reportHour);
  const [minute, setMinute] = useState(settings.reportMinute);
  const [reminderHour, setReminderHour] = useState(settings.reminderHour);
  const [reminderMinute, setReminderMinute] = useState(settings.reminderMinute);
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled);

  useEffect(() => {
    setNickname(settings.nickname);
    setHour(settings.reportHour);
    setMinute(settings.reportMinute);
    setReminderHour(settings.reminderHour);
    setReminderMinute(settings.reminderMinute);
    setReminderEnabled(settings.reminderEnabled);
  }, [settings, open]);

  const handleSave = () => {
    updateSettings({
      nickname,
      reportHour: hour,
      reportMinute: minute,
      reminderHour,
      reminderMinute,
      reminderEnabled,
    });
    setOpen(false);
  };

  const handleToggleReminder = async () => {
    if (!reminderEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('需要开启浏览器通知权限才能使用打卡提醒功能哦～');
        return;
      }
    }
    setReminderEnabled(!reminderEnabled);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors"
      >
        <SettingsIcon size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
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
                <h2 className="text-lg font-bold text-pink-800">设置</h2>
                <button onClick={() => setOpen(false)} className="p-1 rounded-xl hover:bg-pink-50 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">昵称</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="给自己取个可爱的名字吧"
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">每日日报推送时间</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      className="flex-1 px-3 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-center"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 font-bold">:</span>
                    <select
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="flex-1 px-3 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-center"
                    >
                      {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-pink-400 mt-2">到设定时间后，如果浏览器打开着，会自动弹出日报</p>
                </div>

                <div className="border-t border-pink-50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                      <Bell size={14} /> 打卡提醒
                    </label>
                    <button
                      onClick={handleToggleReminder}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        reminderEnabled
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {reminderEnabled ? <Bell size={12} /> : <BellOff size={12} />}
                      {reminderEnabled ? '已开启' : '已关闭'}
                    </button>
                  </div>

                  {reminderEnabled && (
                    <div className="flex items-center gap-2">
                      <select
                        value={reminderHour}
                        onChange={(e) => setReminderHour(Number(e.target.value))}
                        className="flex-1 px-3 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-center"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span className="text-gray-400 font-bold">:</span>
                      <select
                        value={reminderMinute}
                        onChange={(e) => setReminderMinute(Number(e.target.value))}
                        className="flex-1 px-3 py-3 rounded-xl border border-pink-100 bg-pink-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none text-center"
                      >
                        {[0, 15, 30, 45].map((m) => (
                          <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <p className="text-xs text-pink-400 mt-2">到时间后通过浏览器通知提醒你打卡</p>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 rounded-xl bg-pink-400 text-white font-semibold text-sm hover:bg-pink-500 transition-all active:scale-[0.98]"
                >
                  保存设置 ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}