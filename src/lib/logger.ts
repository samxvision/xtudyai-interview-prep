'use client';

export interface LogEntry {
  id: string;
  type: 'error' | 'info' | 'warn';
  message: string;
  details?: string;
  timestamp: string;
}

const LOGS_STORAGE_KEY = 'xtudyai-logs';
const MAX_LOGS = 100;

export const getLogs = (): LogEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedLogs = window.localStorage.getItem(LOGS_STORAGE_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error("Failed to parse logs from localStorage", error);
    return [];
  }
};

export const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const currentLogs = getLogs();
        const newLog: LogEntry = {
            ...log,
            id: new Date().getTime().toString(),
            timestamp: new Date().toISOString(),
        };

        const updatedLogs = [newLog, ...currentLogs].slice(0, MAX_LOGS);
        window.localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
        console.error("Failed to add log to localStorage", error);
    }
};

export const clearLogs = () => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.removeItem(LOGS_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear logs from localStorage", error);
    }
};
