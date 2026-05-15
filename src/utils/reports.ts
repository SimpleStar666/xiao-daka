import type { Task, CheckIn, DailySummary, Badge, ExportData, Settings, CustomCategory } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';
import { QUOTES } from '@/utils/quotes';

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function getWeekRange(): { start: string; end: string; labels: string[] } {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    labels.push(d.toISOString().slice(0, 10));
  }
  return { start: labels[0], end: labels[6], labels };
}

export function getMonthDays(year?: number, month?: number): string[] {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const labels: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    labels.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return labels;
}

export function getYearMonths(): { label: string; key: string }[] {
  const now = new Date();
  const year = now.getFullYear();
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return months.map((label, i) => ({
    label,
    key: `${year}-${String(i + 1).padStart(2, '0')}`,
  }));
}

export function getDailySummary(
  date: string,
  tasks: Task[],
  records: CheckIn[]
): DailySummary {
  const dayRecords = records.filter((r) => r.date === date);
  const taskResults = tasks.map((task) => {
    const record = dayRecords.find((r) => r.taskId === task.id);
    return { task, completed: record?.completed ?? false };
  });
  const completed = taskResults.filter((t) => t.completed).length;
  return {
    date,
    total: tasks.length,
    completed,
    rate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    tasks: taskResults,
  };
}

export function getStreak(tasks: Task[], records: CheckIn[]): number {
  if (tasks.length === 0) return 0;
  let streak = 0;
  let day = 0;
  while (true) {
    const date = getDateDaysAgo(day);
    const summary = getDailySummary(date, tasks, records);
    if (summary.rate === 100) {
      streak++;
      day++;
    } else if (day === 0) {
      day++;
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function getTotalCheckins(records: CheckIn[]): number {
  return records.filter((r) => r.completed).length;
}

export function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 6) return { text: '夜深了，早点休息哦', emoji: '🌙' };
  if (hour < 9) return { text: '早上好，新的一天开始啦', emoji: '🌅' };
  if (hour < 12) return { text: '上午好，今天也要加油哦', emoji: '☀️' };
  if (hour < 14) return { text: '中午好，别忘了休息一下', emoji: '🍱' };
  if (hour < 18) return { text: '下午好，继续坚持吧', emoji: '🌸' };
  if (hour < 21) return { text: '晚上好，回顾一下今天', emoji: '🌆' };
  return { text: '夜深了，今天辛苦啦', emoji: '💫' };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const TASK_EMOJIS = [
  '🌸', '🐱', '🧸', '🌈', '☁️', '🍰', '🐰', '🦊',
  '🌻', '🎀', '🌙', '🍬', '🐻', '🦋', '🍀', '🐳',
  '🌷', '🐶', '🪴', '🧁', '🦄', '🍩', '🐑', '🌺',
];

export const TASK_COLORS = [
  '#FFB5C2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA',
  '#F3B0C3', '#FFE5B4', '#D4F0F0', '#FFC8A2', '#E8D5B7',
];

export const TASK_CATEGORIES = DEFAULT_CATEGORIES;

export function getAllCategories(customCategories: CustomCategory[]) {
  return [...DEFAULT_CATEGORIES, ...customCategories];
}

export function getCategoryInfo(categoryId: string, customCategories: CustomCategory[]) {
  const all = getAllCategories(customCategories);
  return all.find((c) => c.id === categoryId) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];
}

export function computeBadges(tasks: Task[], records: CheckIn[]): Badge[] {
  const streak = getStreak(tasks, records);
  const total = getTotalCheckins(records);
  const allBadges: Badge[] = [
    { id: 'first', name: '初心萌芽', emoji: '🌱', description: '完成第一次打卡', unlocked: total >= 1 },
    { id: 'streak3', name: '小试牛刀', emoji: '🔥', description: '连续打卡3天', unlocked: streak >= 3 },
    { id: 'streak7', name: '一周达人', emoji: '⭐', description: '连续打卡7天', unlocked: streak >= 7 },
    { id: 'streak30', name: '月度之星', emoji: '🌙', description: '连续打卡30天', unlocked: streak >= 30 },
    { id: 'streak100', name: '习惯大师', emoji: '👑', description: '连续打卡100天', unlocked: streak >= 100 },
    { id: 'total10', name: '初露锋芒', emoji: '🌸', description: '累计打卡10次', unlocked: total >= 10 },
    { id: 'total50', name: '坚持不懈', emoji: '💎', description: '累计打卡50次', unlocked: total >= 50 },
    { id: 'total100', name: '百炼成钢', emoji: '🏆', description: '累计打卡100次', unlocked: total >= 100 },
    { id: 'task5', name: '多面手', emoji: '🎪', description: '同时拥有5个任务', unlocked: tasks.length >= 5 },
    { id: 'perfect', name: '完美一天', emoji: '✨', description: '某天全部任务完成', unlocked: records.length > 0 && hasPerfectDay(tasks, records) },
  ];
  return allBadges;
}

function hasPerfectDay(tasks: Task[], records: CheckIn[]): boolean {
  if (tasks.length === 0) return false;
  const dates = [...new Set(records.map((r) => r.date))];
  for (const date of dates) {
    const summary = getDailySummary(date, tasks, records);
    if (summary.rate === 100) return true;
  }
  return false;
}

export function getDailyQuote(): { text: string; author: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function exportData(tasks: Task[], records: CheckIn[], settings: Settings, customCategories: CustomCategory[] = []): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    records,
    settings,
    customCategories,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `小打卡_备份_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(jsonStr: string): { tasks: Task[]; records: CheckIn[]; settings: Settings; customCategories: CustomCategory[] } | null {
  try {
    const data: ExportData = JSON.parse(jsonStr);
    if (!data.tasks || !data.records) return null;
    return {
      tasks: data.tasks.map((t) => ({ ...t, category: t.category || 'other' })),
      records: data.records,
      settings: data.settings || loadDefaultSettings(),
      customCategories: data.customCategories || [],
    };
  } catch {
    return null;
  }
}

function loadDefaultSettings(): Settings {
  return { nickname: '', reportHour: 21, reportMinute: 0, reminderHour: 9, reminderMinute: 0, reminderEnabled: false };
}

export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return Promise.resolve(false);
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') return Promise.resolve(false);
  return Notification.requestPermission().then((p) => p === 'granted');
}

export function sendNotification(title: string, body: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '🌸',
    tag: 'checkin-reminder',
  });
}