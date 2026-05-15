import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useCheckinStore } from '@/stores/checkinStore';
import { getWeekRange, getDailySummary } from '@/utils/reports';

export default function WeeklyReport() {
  const { tasks, records } = useCheckinStore();
  const { labels } = getWeekRange();

  const data = useMemo(() => {
    return labels.map((date) => {
      const summary = getDailySummary(date, tasks, records);
      return {
        date: date.slice(5),
        rate: summary.rate,
        completed: summary.completed,
        total: summary.total,
      };
    });
  }, [labels, tasks, records]);

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
      <h3 className="text-base font-bold text-pink-800 mb-4">📊 本周打卡趋势</h3>
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          <p className="text-3xl mb-2">📝</p>
          <p>还没有任务哦，先去添加一个吧</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce4ec" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#f8bbd0' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(_, i) => weekDays[i]}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#f8bbd0' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Bar dataKey="rate" radius={[8, 8, 0, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.rate >= 80 ? '#B5EAD7' : entry.rate >= 40 ? '#FFDAC1' : '#FFB5C2'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}