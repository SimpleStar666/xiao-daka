import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const timer = setTimeout(() => setShowPrompt(true), 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        return;
      }
    }
    setShowGuide(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-50"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-5">
          {showGuide ? (
            <>
              <div className="text-center mb-3">
                <span className="text-3xl">📲</span>
                <h3 className="text-base font-bold text-gray-800 mt-2">安装指南</h3>
              </div>
              <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
                {isAndroid && (
                  <>
                    <p>1️⃣ 点击浏览器右上角菜单 <span className="font-bold">⋮</span></p>
                    <p>2️⃣ 选择 <span className="font-bold">「安装应用」</span>或<span className="font-bold">「添加到主屏幕」</span></p>
                  </>
                )}
                {isIOS && (
                  <>
                    <p>1️⃣ 点击底部 <span className="font-bold">⬆️ 分享按钮</span></p>
                    <p>2️⃣ 滑动找到并点击 <span className="font-bold">「添加到主屏幕」</span></p>
                    <p>3️⃣ 点击右上角 <span className="font-bold">「添加」</span></p>
                  </>
                )}
                {!isIOS && !isAndroid && (
                  <>
                    <p>💻 电脑端也可安装为桌面应用：</p>
                    <p>1️⃣ 点击浏览器地址栏右侧的 <span className="font-bold">安装图标</span></p>
                    <p>2️⃣ 或点击浏览器菜单 → <span className="font-bold">「安装小打卡」</span></p>
                  </>
                )}
              </div>
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                知道了
              </button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5C2] to-[#FF8FA3] flex items-center justify-center text-2xl shrink-0">
                  🌸
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">添加到主屏幕</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    安装到桌面，随时随地打开打卡！
                  </p>
                </div>
              </div>
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
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}