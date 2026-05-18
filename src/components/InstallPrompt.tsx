import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const APK_URL = 'https://github.com/SimpleStar666/xiao-daka/releases/download/android-latest/app-debug.apk';

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

function isPWAAble(b: string) {
  return b === 'chrome' || b === 'edge' || b === 'safari_ios';
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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

  const pwaAble = browser === 'safari_ios' ? true : isPWAAble(browser);

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
            <GuidePanel
              browser={browser}
              isIOS={isIOS}
              pwaAble={pwaAble || !!deferredPrompt}
              apkUrl={APK_URL}
              onDismiss={handleDismiss}
              downloaded={downloaded}
              setDownloaded={setDownloaded}
            />
          ) : (
            <PromptButtons
              hasNative={!!deferredPrompt}
              browser={browser}
              pwaAble={pwaAble}
              apkUrl={APK_URL}
              onNativeInstall={doNativeInstall}
              onGuide={openGuide}
              onDismiss={handleDismiss}
              downloaded={downloaded}
              setDownloaded={setDownloaded}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function PromptButtons({
  hasNative, browser, pwaAble, apkUrl, onNativeInstall, onGuide, onDismiss, downloaded, setDownloaded,
}: {
  hasNative: boolean; browser: string; pwaAble: boolean; apkUrl: string;
  onNativeInstall: () => void; onGuide: () => void; onDismiss: () => void;
  downloaded: boolean; setDownloaded: (v: boolean) => void;
}) {
  const isWechat = browser === 'wechat';
  const canPwa = hasNative || (pwaAble && browser !== 'wechat');

  const handleApkDownload = () => {
    setDownloaded(true);
    window.open(apkUrl, '_blank');
  };

  return (
    <>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5C2] to-[#FF8FA3] flex items-center justify-center text-2xl shrink-0">
          🌸
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">
            {isWechat ? '请用浏览器打开' : '安装小打卡'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isWechat ? '微信不支持安装，点右上角···→在浏览器打开' : '一键下载安装包，到桌面随时打卡'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {canPwa ? (
          <button
            onClick={onNativeInstall}
            className="w-full py-3 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95"
          >
            {hasNative ? '✨ 一键添加到桌面' : '📲 查看安装步骤'}
          </button>
        ) : (
          <>
            <a
              href={apkUrl}
              onClick={handleApkDownload}
              className="block w-full py-3 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95 text-center"
            >
              📦 点击下载 APK 安装包
            </a>
            <p className="text-xs text-center text-gray-400">
              {downloaded ? '⏳ 下载中...安装时请允许「未知来源」' : '安装时请允许「安装未知来源应用」'}
            </p>
          </>
        )}

        {!isWechat && !canPwa && (
          <button
            onClick={onGuide}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-xl border border-gray-100 transition-colors"
          >
            查看其他安装方式
          </button>
        )}

        <button
          onClick={onDismiss}
          className="w-full py-2 text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          暂不需要
        </button>
      </div>

      {canPwa && browser !== 'wechat' && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400 text-center mb-2">或者直接下载 APK</p>
          <a
            href={apkUrl}
            onClick={handleApkDownload}
            className="block w-full py-2.5 text-sm text-pink-400 font-medium rounded-xl border border-pink-100 hover:bg-pink-50 transition-colors active:bg-pink-100 text-center"
          >
            📦 下载 APK 安装包
          </a>
        </div>
      )}
    </>
  );
}

function GuidePanel({
  browser, isIOS, pwaAble, apkUrl, onDismiss, downloaded, setDownloaded,
}: {
  browser: string; isIOS: boolean; pwaAble: boolean; apkUrl: string; onDismiss: () => void;
  downloaded: boolean; setDownloaded: (v: boolean) => void;
}) {
  const handleApkDownload = () => {
    setDownloaded(true);
    window.open(apkUrl, '_blank');
  };

  return (
    <>
      <div className="text-center mb-3">
        <span className="text-3xl">📲</span>
        <h3 className="text-base font-bold text-gray-800 mt-2">安装指南</h3>
      </div>

      {(browser === 'wechat' || browser === 'qq' || browser === 'uc' || browser === 'baidu' || (!pwaAble && !isIOS)) && (
        <div className="bg-orange-50 rounded-xl p-3 text-sm space-y-2 mb-3 border border-orange-100">
          <p className="text-orange-600 font-medium">📦 推荐：直接下载 APK</p>
          <p className="text-gray-500 text-xs">最方便！下载后点击安装即可使用</p>
          <a
            href={apkUrl}
            onClick={handleApkDownload}
            className="block w-full py-2.5 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-[#FFB5C2] to-[#FF8FA3] hover:shadow-lg transition-all active:scale-95 text-center"
          >
            下载 APK 安装包 📥
          </a>
          {downloaded && (
            <p className="text-xs text-gray-400 text-center">请允许「安装未知来源应用」，然后点击安装</p>
          )}
        </div>
      )}

      {browser === 'wechat' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-pink-600 font-medium">⚠️ 微信内无法安装</p>
          <p>请点击右上角 <span className="font-bold">「···」</span> → <span className="font-bold">「在浏览器中打开」</span></p>
          <p className="text-xs text-gray-400">打开后即可用浏览器安装或下载 APK</p>
        </div>
      )}

      {browser === 'chrome' && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-green-600 font-medium">✅ Chrome 支持 PWA！</p>
          <p className="font-bold">方式一（推荐）：</p>
          <p>地址栏右侧 <span className="font-bold">⊕ 安装图标</span>，点击即可安装</p>
          <p className="font-bold mt-1">方式二：</p>
          <p>右上角 <span className="font-bold">⋮ 菜单</span> → <span className="font-bold">「安装应用」</span></p>
        </div>
      )}

      {(browser === 'safari_ios' || browser === 'chrome_ios' || (isIOS && !pwaAble)) && (
        <div className="bg-pink-50 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p className="text-green-600 font-medium">✅ Safari 支持！</p>
          <p>1️⃣ 点击底部 <span className="font-bold">⬆️ 分享按钮</span></p>
          <p>2️⃣ 滑动找到 <span className="font-bold">「添加到主屏幕」</span></p>
          <p>3️⃣ 点击右上角 <span className="font-bold">「添加」</span></p>
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