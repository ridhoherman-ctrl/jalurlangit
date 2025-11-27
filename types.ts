
export type Category = 
  | 'Dzikir dan Doa'
  | 'Puasa Sunnah'
  | 'Sedekah'
  | 'Sholat Sunnah'
  | 'Sholat Wajib'
  | 'Tilawah Al Qur’an';

export interface IbadahItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  target: string;
  points: number;
  isCustom?: boolean;
}

export interface QuranProgress {
  surah: string;
  ayat: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedIds: string[];
  mood: string; // Emoji char
  reflection: string;
  gratitude: string;
  hope: string;
  totalPoints: number;
  quranLastRead?: QuranProgress;
}

export type ExclusionReason = 'Haid' | 'Nifas' | 'Sakit' | 'Lainnya';

export interface ExclusionPeriod {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: ExclusionReason;
  note: string;
}

export interface UserSettings {
  name: string;
}

export type TimeZone = 'WIB' | 'WITA' | 'WIT';

export const INITIAL_IBADAH: IbadahItem[] = [
  { id: '1', name: 'Dzikir Pagi', category: 'Dzikir dan Doa', description: 'Dzikir Setelah Shalat Subuh', target: '1x', points: 5 },
  { id: '2', name: 'Dzikir Petang', category: 'Dzikir dan Doa', description: 'Dzikir Setelah Shalat Ashar', target: '1x', points: 5 },
  { id: '3', name: 'Istighfar', category: 'Dzikir dan Doa', description: 'Memohon Ampun Kepada Allah', target: '100x', points: 3 },
  { id: '4', name: 'Tasbih, Tahmid, Takbir', category: 'Dzikir dan Doa', description: 'Dzikir Setelah Shalat', target: 'Setiap Sholat', points: 2 },
  { id: '5', name: 'Puasa Ayyamul Bidh', category: 'Puasa Sunnah', description: 'Puasa Tanggal 13, 14 ,15 Hijriah', target: 'Bulanan', points: 12 },
  { id: '6', name: 'Puasa Senin Kamis', category: 'Puasa Sunnah', description: 'Puasa Sunah Hari Senin dan Kamis', target: 'Mingguan', points: 15 },
  { id: '7', name: 'Infaq di Mesjid', category: 'Sedekah', description: 'Berinfaq untuk Mesjid', target: 'Harian', points: 8 },
  { id: '8', name: 'Sedekah Harian', category: 'Sedekah', description: 'Bersedekah setiap Hari', target: 'Harian', points: 10 },
  { id: '9', name: 'Sholat Tahajjud', category: 'Sholat Sunnah', description: 'Sholat Sunnah Malam', target: 'Min 2 Rakaat', points: 8 },
  { id: '10', name: 'Sholat Witr', category: 'Sholat Sunnah', description: 'Sholat Sunnah Penutup Sholat Malam', target: 'Min 1 Rakaat', points: 5 },
  { id: '11', name: 'Sholat Dhuha', category: 'Sholat Sunnah', description: 'Sholat Sunnah di waktu Dhuha', target: 'Min 2 Rakaat', points: 5 },
  { id: '12', name: 'Sholat Rawatib', category: 'Sholat Sunnah', description: 'Sholat Sebelum dan Sesudah Shalat Fardhu', target: '10/12 Rakaat', points: 3 },
  { id: '13', name: 'Sholat Subuh', category: 'Sholat Wajib', description: 'Sholat Wajib di Waktu Fajar', target: 'Wajib', points: 10 },
  { id: '14', name: 'Sholat Dzuhur', category: 'Sholat Wajib', description: 'Sholat Wajib di Waktu Siang', target: 'Wajib', points: 10 },
  { id: '15', name: 'Sholat Ashar', category: 'Sholat Wajib', description: 'Sholat Wajib di Waktu Sore', target: 'Wajib', points: 10 },
  { id: '16', name: 'Sholat Maghrib', category: 'Sholat Wajib', description: 'Sholat Wajib di Waktu Senja', target: 'Wajib', points: 10 },
  { id: '17', name: 'Sholat Isya', category: 'Sholat Wajib', description: 'Sholat Wajib di Waktu Malam', target: 'Wajib', points: 10 },
  { id: '18', name: 'Tilawatil Al-Qur’an', category: 'Tilawah Al Qur’an', description: 'Membaca Al Qur’an', target: '1 Juz/Hari', points: 10 },
];
