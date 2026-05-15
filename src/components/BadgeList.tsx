import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Badge } from '@/types';

interface BadgeListProps {
  badges: Badge[];
}

export default function BadgeList({ badges }: BadgeListProps) {
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-4">
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-pink-600 mb-2">已解锁 ({unlocked.length})</h3>
          <div className="grid grid-cols-5 gap-2">
            {unlocked.map((badge) => (
              <motion.button
                key={badge.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setActiveBadge(activeBadge?.id === badge.id ? null : badge)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-amber-50 flex items-center justify-center text-2xl shadow-sm border transition-all ${
                  activeBadge?.id === badge.id ? 'border-pink-400 scale-110' : 'border-pink-100'
                }`}>
                  {badge.emoji}
                </div>
                <span className="text-[10px] text-pink-600 text-center leading-tight">{badge.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">待解锁 ({locked.length})</h3>
          <div className="grid grid-cols-5 gap-2">
            {locked.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setActiveBadge(activeBadge?.id === badge.id ? null : badge)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl border transition-all ${
                  activeBadge?.id === badge.id ? 'border-gray-400 opacity-60' : 'border-gray-200 opacity-40'
                }`}>
                  {badge.emoji}
                </div>
                <span className="text-[10px] text-gray-400 text-center leading-tight">{badge.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeBadge && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-2xl text-center ${
            activeBadge.unlocked
              ? 'bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-100'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <span className="text-2xl">{activeBadge.emoji}</span>
          <p className={`text-sm font-semibold mt-1 ${activeBadge.unlocked ? 'text-pink-700' : 'text-gray-500'}`}>
            {activeBadge.name}
          </p>
          <p className={`text-xs mt-0.5 ${activeBadge.unlocked ? 'text-pink-400' : 'text-gray-400'}`}>
            {activeBadge.description}
          </p>
          {activeBadge.unlocked && (
            <p className="text-[10px] text-pink-300 mt-1">✅ 已解锁</p>
          )}
        </motion.div>
      )}

      {badges.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <p className="text-3xl mb-2">🏅</p>
          <p>开始打卡来解锁成就吧！</p>
        </div>
      )}
    </div>
  );
}