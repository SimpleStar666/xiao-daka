import type { Task, CheckIn, Settings, CustomCategory } from '@/types';

const TASKS_KEY = 'checkin_tasks';
const RECORDS_KEY = 'checkin_records';
const SETTINGS_KEY = 'checkin_settings';
const CATEGORIES_KEY = 'checkin_custom_categories';

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    const tasks: Task[] = data ? JSON.parse(data) : [];
    return tasks.map((t) => ({ ...t, category: t.category || 'other' }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadRecords(): CheckIn[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: CheckIn[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function loadSettings(): Settings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const s = JSON.parse(data);
      return {
        nickname: s.nickname || '',
        reportHour: s.reportHour ?? 21,
        reportMinute: s.reportMinute ?? 0,
        reminderHour: s.reminderHour ?? 9,
        reminderMinute: s.reminderMinute ?? 0,
        reminderEnabled: s.reminderEnabled ?? false,
      };
    }
  } catch {
    // fallback
  }
  return { nickname: '', reportHour: 21, reportMinute: 0, reminderHour: 9, reminderMinute: 0, reminderEnabled: false };
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadCustomCategories(): CustomCategory[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: CustomCategory[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}