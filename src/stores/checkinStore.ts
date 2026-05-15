import { create } from 'zustand';
import type { Task, CheckIn, Settings, CustomCategory } from '@/types';
import { loadTasks, saveTasks, loadRecords, saveRecords, loadSettings, saveSettings, loadCustomCategories, saveCustomCategories } from '@/utils/storage';
import { todayStr, generateId } from '@/utils/reports';

interface CheckinState {
  tasks: Task[];
  records: CheckIn[];
  settings: Settings;
  customCategories: CustomCategory[];
  showReport: boolean;

  loadAll: () => void;
  addTask: (name: string, type: 'short' | 'long', emoji: string, color: string, category: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleCheckIn: (taskId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setShowReport: (show: boolean) => void;
  addCustomCategory: (label: string, emoji: string, color: string) => void;
  deleteCustomCategory: (id: string) => void;
  importAll: (tasks: Task[], records: CheckIn[], settings: Settings, customCategories: CustomCategory[]) => void;
  getTodayRecords: () => CheckIn[];
  getTodayCompletion: () => { completed: number; total: number; rate: number };
}

export const useCheckinStore = create<CheckinState>((set, get) => ({
  tasks: loadTasks(),
  records: loadRecords(),
  settings: loadSettings(),
  customCategories: loadCustomCategories(),
  showReport: false,

  loadAll: () => {
    set({
      tasks: loadTasks(),
      records: loadRecords(),
      settings: loadSettings(),
      customCategories: loadCustomCategories(),
    });
  },

  addTask: (name, type, emoji, color, category) => {
    const task: Task = {
      id: generateId(),
      name,
      type,
      emoji,
      color,
      category,
      createdAt: new Date().toISOString(),
      order: get().tasks.length,
    };
    const tasks = [...get().tasks, task];
    saveTasks(tasks);
    set({ tasks });
  },

  updateTask: (id, updates) => {
    const tasks = get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTasks(tasks);
    set({ tasks });
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    const records = get().records.filter((r) => r.taskId !== id);
    saveTasks(tasks);
    saveRecords(records);
    set({ tasks, records });
  },

  toggleCheckIn: (taskId) => {
    const date = todayStr();
    const records = [...get().records];
    const idx = records.findIndex((r) => r.taskId === taskId && r.date === date);

    if (idx >= 0) {
      records[idx] = { ...records[idx], completed: !records[idx].completed, checkedAt: new Date().toISOString() };
    } else {
      records.push({ taskId, date, completed: true, checkedAt: new Date().toISOString() });
    }
    saveRecords(records);
    set({ records });
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    saveSettings(settings);
    set({ settings });
  },

  setShowReport: (show) => set({ showReport: show }),

  addCustomCategory: (label, emoji, color) => {
    const cat: CustomCategory = {
      id: 'custom_' + generateId(),
      label,
      emoji,
      color,
    };
    const customCategories = [...get().customCategories, cat];
    saveCustomCategories(customCategories);
    set({ customCategories });
  },

  deleteCustomCategory: (id) => {
    const customCategories = get().customCategories.filter((c) => c.id !== id);
    saveCustomCategories(customCategories);
    set({ customCategories });
  },

  importAll: (tasks, records, settings, customCategories) => {
    saveTasks(tasks);
    saveRecords(records);
    saveSettings(settings);
    saveCustomCategories(customCategories);
    set({ tasks, records, settings, customCategories });
  },

  getTodayRecords: () => {
    const date = todayStr();
    return get().records.filter((r) => r.date === date);
  },

  getTodayCompletion: () => {
    const tasks = get().tasks;
    const todayRecords = get().getTodayRecords();
    if (tasks.length === 0) return { completed: 0, total: 0, rate: 0 };
    const completed = tasks.filter((t) =>
      todayRecords.some((r) => r.taskId === t.id && r.completed)
    ).length;
    return {
      completed,
      total: tasks.length,
      rate: Math.round((completed / tasks.length) * 100),
    };
  },
}));