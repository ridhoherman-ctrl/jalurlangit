
import { IbadahItem, DailyLog, ExclusionPeriod, UserSettings, INITIAL_IBADAH, USER_LEVELS, UserLevel } from '../types';
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
  return stored ? JSON.parse(stored) : { name: 'Hamba Allah' };
};

export const saveUserSettings = (settings: UserSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const hasUserSettings = (): boolean => {
  return localStorage.getItem(KEYS.SETTINGS) !== null;
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
  
  const todayLog = logs[today];
  if (todayLog && todayLog.totalPoints > 0) {
    streak++;
  }

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

export const getUserLevel = (): UserLevel => {
  const logs = getAllLogs();
  const totalPoints = Object.values(logs).reduce((sum, log) => sum + log.totalPoints, 0);
  
  // Find the highest level achieved
  return USER_LEVELS.slice().reverse().find(lvl => totalPoints >= lvl.minPoints) || USER_LEVELS[0];
};

export const getTotalPoints = (): number => {
  const logs = getAllLogs();
  return Object.values(logs).reduce((sum, log) => sum + log.totalPoints, 0);
};

// --- DATA BACKUP & RESTORE ---

export const exportData = (): string => {
  const data = {
    settings: getUserSettings(),
    ibadahList: getIbadahList(),
    logs: getAllLogs(),
    exclusions: getExclusions(),
    version: '1.0',
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.logs || !data.ibadahList) throw new Error("Invalid Format");
    
    // Validate simple structure
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
    localStorage.setItem(KEYS.IBADAH_LIST, JSON.stringify(data.ibadahList));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(data.logs));
    localStorage.setItem(KEYS.EXCLUSIONS, JSON.stringify(data.exclusions));
    
    return true;
  } catch (e) {
    console.error("Import Failed", e);
    return false;
  }
};
