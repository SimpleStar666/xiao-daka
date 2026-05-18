import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectBrowser() {
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();

  if (/MicroMessenger/i.test(ua)) return 'wechat';
  if (/(QQ|MQQBrowser)\//i.test(ua)) return 'qq';
  if (/UCBrowser|UBrowser/i.test(ua)) return 'uc';
  if (/baidu/i.test(uaLower) && /baidubrowser/i.test(uaLower)) return 'baidu';
  if (/Edg/i.test(ua)) return 'edge';
  if (/CriOS/i.test(ua)) return 'chrome_ios';
  if (/Chrome/i.test(ua) && /android/i.test(uaLower)) return 'chrome';
  if (/safari/i.test(ua) && /iphone|ipad|ipod/i.test(uaLower) && !/CriOS/i.test(ua)) return 'safari_ios';
  if (/firefox/i.test(uaLower)) return 'firefox';
  return 'other';
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const browser = useMemo(() => detectBrowser(), []);
  const isIOS = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const timer = setTimeout(() => setShowPrompt(true), 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const doNativeInstall = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt().then(() => deferredPrompt.userChoice).then((res) => {
        if (res.outcome === 'accepted') {
          setShowPrompt(false);
          setShowGuide(false);
        }
      }).catch(() => {});
    }
  }, [deferredPrompt]);

  const openGuide = useCallback(() => setShowGuide(true), []);
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setShowGuide(false);
  }, []);

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
          {showGuide ? (
            <GuidePanel browser={browser} isIOS={isIOS} onDismiss={handleDismiss} />
          ) : (
            <PromptButtons
              hasNative={!!deferredPrompt}
              browser={browser}
              onNativeInstall={doNativeInstall}
              onGuide={openGuide}
              onDismiss={handleDismiss}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function PromptButtons({
  hasNative, browser, onNativeInstall, onGuide, onDismiss,
}: {
  hasNative: boolean; browser: string; onNativeInstall: () => void; onGuide: () => void; onDismiss: () => void;
}) {
  const isWechat = browser === 'wechat';

  return (
    <>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5C2] to-[#FF8FA3] flex items-center justify-center text-2xl shrink-0">
          🌸
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">
            {isWechat ? '请用浏览器打开' : '添加到主屏幕'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isWechat
              ? '微信不支持安装，用浏览器打开即可安装'
              : '安装到桌面，随时随地打开打卡！'}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onDismiss}
          className="flex-1 py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-xl border border-gray-100 transition-colors"
        >
          暂不需要
        </button>
        {hasNative ? (
          <button
            onClick={onNativeInstall}
            className="flex-1 py-2.5 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95"
          >
            一键安装 ✨
          </button>
        ) : (
          <button
            onClick={onGuide}
            className="flex-1 py-2.5 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95"
          >
            {isWechat ? '切换浏览器 👉' : '如何安装 📲'}
          </button>
        )}
      </div>
    </>
  );
}

function GuidePanel({
  browser, isIOS, onDismiss,
}: {
  browser: string; isIOS: boolean; onDismiss: () => void;
}) {
  return (
    <>
      <div className="text-center mb-3">
        <span className="text-3xl">📲</span>
        <h3 className="text-base font-bold text-gray-800 mt-2">安装指南</h3>
      </div>

      {browser === 'wechat' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">⚠️ 微信内无法安装</p>
          <p>请点击右上角 <span className="font-bold">「···」</span> 按钮</p>
          <p>选择 <span className="font-bold">「在浏览器中打开」</span></p>
          <p className="text-xs text-gray-400 mt-1">
            推荐使用 Chrome 浏览器或手机自带浏览器打开，即可安装
          </p>
        </div>
      )}

      {browser === 'qq' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">QQ浏览器可能不支持安装</p>
          <p>建议复制网址，用 <span className="font-bold">Chrome 浏览器</span> 或<span className="font-bold">手机自带浏览器</span>打开</p>
          <p>网址：<span className="text-xs text-pink-500 break-all">simplestar666.github.io/xiao-daka/</span></p>
        </div>
      )}

      {browser === 'uc' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">UC浏览器可能不支持安装</p>
          <p>建议复制网址，用 <span className="font-bold">Chrome 浏览器</span> 或<span className="font-bold">手机自带浏览器</span>打开</p>
          <p>网址：<span className="text-xs text-pink-500 break-all">simplestar666.github.io/xiao-daka/</span></p>
        </div>
      )}

      {browser === 'baidu' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">百度浏览器可能不支持安装</p>
          <p>建议复制网址，用 <span className="font-bold">Chrome 浏览器</span> 或<span className="font-bold">手机自带浏览器</span>打开</p>
          <p>网址：<span className="text-xs text-pink-500 break-all">simplestar666.github.io/xiao-daka/</span></p>
        </div>
      )}

      {browser === 'chrome' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-green-600 font-medium">✅ Chrome 完全支持！</p>
          <p className="font-bold">方式一（推荐）：</p>
          <p>地址栏右侧有一个 <span className="font-bold">⊕ 安装图标</span>，点击即可安装</p>
          <p className="font-bold mt-1">方式二：</p>
          <p>点击右上角 <span className="font-bold">⋮ 菜单</span> → <span className="font-bold">「安装应用」</span></p>
        </div>
      )}

      {browser === 'edge' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-green-600 font-medium">✅ Edge 完全支持！</p>
          <p>点击底部菜单 <span className="font-bold">「···」</span> → <span className="font-bold">「添加到手机」</span>或<span className="font-bold">「添加到主屏幕」</span></p>
        </div>
      )}

      {(browser === 'safari_ios' || browser === 'chrome_ios' || (isIOS && browser === 'other')) && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-green-600 font-medium">✅ Safari 完全支持！</p>
          <p>1️⃣ 点击底部正中间 <span className="font-bold">⬆️ 分享按钮</span></p>
          <p>2️⃣ 在弹出菜单中向下滑动</p>
          <p>3️⃣ 找到 <span className="font-bold">「添加到主屏幕」</span></p>
          <p>4️⃣ 点击右上角 <span className="font-bold">「添加」</span></p>
        </div>
      )}

      {(browser === 'firefox' || browser === 'other') && !isIOS && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">当前浏览器可能不支持安装</p>
          <p>推荐安装 <span className="font-bold">Chrome（谷歌浏览器）</span></p>
          <p>打开后访问：</p>
          <p className="text-xs text-pink-500 break-all font-mono">simplestar666.github.io/xiao-daka/</p>
          <p className="text-xs text-gray-400 mt-1">Chrome 地址栏右侧会出现 ⊕ 安装按钮</p>
        </div>
      )}

      <button
        onClick={onDismiss}
        className="w-full py-2.5 mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        知道了
      </button>
    </>
  );
}