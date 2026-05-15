import { motion } from 'framer-motion';
import { getGreeting } from '@/utils/reports';
import { useCheckinStore } from '@/stores/checkinStore';

export default function GreetingCard() {
  const { settings } = useCheckinStore();
  const { text, emoji } = getGreeting();
  const nickname = settings.nickname || '小伙伴';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-1"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h1 className="text-xl font-bold text-pink-800">
            {nickname}，{text}
          </h1>
          <p className="text-sm text-pink-400 mt-0.5">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}