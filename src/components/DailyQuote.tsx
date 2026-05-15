import { getDailyQuote } from '@/utils/reports';

export default function DailyQuote() {
  const quote = getDailyQuote();

  return (
    <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl p-4 border border-pink-100/50">
      <p className="text-sm text-pink-700 leading-relaxed">「{quote.text}」</p>
      <p className="text-xs text-pink-400 mt-1.5 text-right">—— {quote.author}</p>
    </div>
  );
}