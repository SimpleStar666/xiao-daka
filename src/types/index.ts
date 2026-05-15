export interface Task {
  id: string;
  name: string;
  type: 'short' | 'long';
  emoji: string;
  color: string;
  category: string;
  createdAt: string;
  order: number;
}

export const DEFAULT_CATEGORIES: { id: string; label: string; emoji: string; color: string }[] = [
  { id: 'health', label: '健康', emoji: '💊', color: '#B5EAD7' },
  { id: 'study', label: '学习', emoji: '📖', color: '#C7CEEA' },
  { id: 'life', label: '生活', emoji: '🏠', color: '#FFDAC1' },
  { id: 'sport', label: '运动', emoji: '🏃', color: '#FFB5C2' },
  { id: 'other', label: '其他', emoji: '✨', color: '#E8D5B7' },
];

export interface CustomCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface CheckIn {
  taskId: string;
  date: string;
  completed: boolean;
  checkedAt: string;
}

export interface Settings {
  nickname: string;
  reportHour: number;
  reportMinute: number;
  reminderHour: number;
  reminderMinute: number;
  reminderEnabled: boolean;
}

export interface DailySummary {
  date: string;
  total: number;
  completed: number;
  rate: number;
  tasks: { task: Task; completed: boolean }[];
}

export type ReportType = 'weekly' | 'monthly' | 'yearly';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  records: CheckIn[];
  settings: Settings;
  customCategories?: CustomCategory[];
}