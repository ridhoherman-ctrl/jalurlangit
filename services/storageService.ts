
import { IbadahItem, DailyLog, ExclusionPeriod, UserSettings, INITIAL_IBADAH } from '../types';
import { format, isWithinInterval } from 'date-fns';

const KEYS = {
  IBADAH_LIST: 'jl_ibadah_list',
  LOGS: 'jl_logs',
  EXCLUSIONS: 'jl_exclusions',
  SETTINGS: 'jl_settings',
};

export const getIbadahList = (): IbadahItem[] => {
  const stored = localStorage.getItem(KEYS.IBADAH_LIST);
  if (!stored) {
    localStorage.setItem(KEYS.IBADAH_LIST, JSON.stringify(INITIAL_IBADAH));
    return INITIAL_IBADAH;
  }
  return JSON.parse(stored);
};

export const saveIbadahList = (list: IbadahItem[]) => {
  localStorage.setItem(KEYS.IBADAH_LIST, JSON.stringify(list));
};

export const getDailyLog = (dateStr: string): DailyLog => {
  const logs = getAllLogs();
  return logs[dateStr] || {
    date: dateStr,
    completedIds: [],
    mood: '',
    reflection: '',
    gratitude: '',
    hope: '',
    totalPoints: 0,
    quranLastRead: { surah: '', ayat: '' }
  };
};

export const getAllLogs = (): Record<string, DailyLog> => {
  const stored = localStorage.getItem(KEYS.LOGS);
  return stored ? JSON.parse(stored) : {};
};

export const saveDailyLog = (log: DailyLog) => {
  const logs = getAllLogs();
  logs[log.date] = log;
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};

export const getExclusions = (): ExclusionPeriod[] => {
  const stored = localStorage.getItem(KEYS.EXCLUSIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveExclusions = (exclusions: ExclusionPeriod[]) => {
  localStorage.setItem(KEYS.EXCLUSIONS, JSON.stringify(exclusions));
};

export const getUserSettings = (): UserSettings => {
  const stored = localStorage.getItem(KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : { name: 'Ani' };
};

export const isDateExcluded = (date: Date): ExclusionPeriod | undefined => {
  const exclusions = getExclusions();
  return exclusions.find(ex => 
    isWithinInterval(date, { start: new Date(ex.startDate), end: new Date(ex.endDate) })
  );
};

export const calculateStreak = (today: string): number => {
  const logs = getAllLogs();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check today first. If no points today, check yesterday for streak continuity
  // But commonly streak includes today if active, or yesterday back
  
  // Simple logic: Go back day by day.
  // If today has activity, start from today. Else start from yesterday.
  
  const todayLog = logs[today];
  if (todayLog && todayLog.totalPoints > 0) {
    streak++;
  }

  // Loop backwards
  for (let i = 1; i < 365; i++) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const log = logs[dateStr];
    if (log && log.totalPoints > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};
