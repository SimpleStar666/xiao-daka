import { useMemo } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Area, AreaChart,
} from 'recharts';
import { useCheckinStore } from '@/stores/checkinStore';
import { getYearMonths, getDailySummary } from '@/utils/reports';

export default function YearlyReport() {
  const { tasks, records } = useCheckinStore();
  const months = getYearMonths();

  const data = useMemo(() => {
    return months.map(({ label, key }) => {
      const year = parseInt(key.slice(0, 4));
      const month = parseInt(key.slice(5, 7));
      const daysInMonth = new Date(year, month, 0).getDate();
      let totalRate = 0;
      let count = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const date = `${key}-${String(d).padStart(2, '0')}`;
        const summary = getDailySummary(date, tasks, records);
        totalRate += summary.rate;
        count++;
      }
      return {
        month: label,
        rate: count > 0 ? Math.round(totalRate / count) : 0,
      };
    });
  }, [months, tasks, records]);

  const totalCheckins = useMemo(
    () => records.filter((r) => r.completed).length,
    [records]
  );

  const bestMonth = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((best, cur) => (cur.rate > best.rate ? cur : best), data[0]);
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 text-center">
          <p className="text-2xl mb-1">🏆</p>
          <p className="text-2xl font-bold text-pink-500">{totalCheckins}</p>
          <p className="text-xs text-pink-400">总打卡次数</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 text-center">
          <p className="text-2xl mb-1">🌟</p>
          <p className="text-xl font-bold text-amber-500">
            {bestMonth ? `${bestMonth.month}` : '-'}
          </p>
          <p className="text-xs text-amber-400">最佳月份</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
        <h3 className="text-base font-bold text-pink-800 mb-4">📈 年度打卡趋势</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p className="text-3xl mb-2">📝</p>
            <p>还没有任务哦，先去添加一个吧</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFB5C2" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FFB5C2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce4ec" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#f8bbd0' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#f8bbd0' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, '平均完成率']}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#FFB5C2"
                strokeWidth={2}
                fill="url(#yearGradient)"
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#FFB5C2"
                strokeWidth={2}
                dot={{ fill: '#FFB5C2', r: 4 }}
                activeDot={{ r: 6, fill: '#F3B0C3' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}