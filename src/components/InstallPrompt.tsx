import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    const userAgent = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // 立即显示提示，不等待
    const timer = setTimeout(() => setShowPrompt(true), 1500);

    if (!ios) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install_prompt_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-50"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-5">
          {!showIOSGuide ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5C2] to-[#FF8FA3] flex items-center justify-center text-2xl shrink-0">
                  🌸
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">添加到主屏幕</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    安装「小打卡」到手机桌面，像App一样方便使用！
                  </p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3">
                  <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
                    <p>📱 按以下步骤操作：</p>
                    <p>1️⃣ 点击浏览器底部的 <span className="inline-block px-1.5 py-0.5 bg-white rounded text-xs font-bold">⬆️ 分享</span> 按钮</p>
                    <p>2️⃣ 在弹出的菜单中选择 <span className="inline-block px-1.5 py-0.5 bg-white rounded text-xs font-bold">「添加到主屏幕」</span></p>
                    <p>3️⃣ 点击 <span className="inline-block px-1.5 py-0.5 bg-white rounded text-xs font-bold">「添加」</span> 即可完成安装</p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    知道了
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-xl border border-gray-100 transition-colors"
                  >
                    暂不需要
                  </button>
                  <button
                    onClick={handleInstall}
                    className="flex-1 py-2.5 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95"
                  >
                    立即安装 ✨
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
                <p>📱 iOS安装步骤：</p>
                <p>1️⃣ 点击Safari底部的分享按钮 <span className="font-bold">⬆️</span></p>
                <p>2️⃣ 向下滑动，找到并点击 <span className="font-bold">「添加到主屏幕」</span></p>
                <p>3️⃣ 点击右上角 <span className="font-bold">「添加」</span></p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                知道了
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
