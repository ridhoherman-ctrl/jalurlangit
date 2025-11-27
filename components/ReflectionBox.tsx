import React from 'react';
import { DailyLog } from '../types';

interface Props {
  log: DailyLog;
  onUpdate: (updates: Partial<DailyLog>) => void;
}

const MOODS = ['😢', '😟', '😐', '🙂', '😄'];

export const ReflectionBox: React.FC<Props> = ({ log, onUpdate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-lg font-serif font-bold text-emerald-900">Refleksi Harian</h3>
        <div className="flex space-x-2">
          {MOODS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onUpdate({ mood: emoji })}
              className={`text-2xl p-2 rounded-lg transition-transform hover:scale-110 ${
                log.mood === emoji ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'hover:bg-slate-50'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Refleksi dan Evaluasi Hari Ini
          </label>
          <textarea
            value={log.reflection}
            onChange={(e) => onUpdate({ reflection: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none h-24 text-sm"
            placeholder="Apa yang bisa ditingkatkan besok?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rasa Syukur
            </label>
            <input
              type="text"
              value={log.gratitude}
              onChange={(e) => onUpdate({ gratitude: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="Alhamdulillah untuk..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Harapan Hari Ini
            </label>
            <input
              type="text"
              value={log.hope}
              onChange={(e) => onUpdate({ hope: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="Semoga..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
