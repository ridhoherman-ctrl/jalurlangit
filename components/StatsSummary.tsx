
import React from 'react';
import { DailyLog } from '../types';
import { calculateStreak } from '../services/storageService';
import { Activity, Flame } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  log: DailyLog;
  maxPoints: number;
  history: DailyLog[]; // Last 7 days
}

export const StatsSummary: React.FC<Props> = ({ log, maxPoints, history }) => {
  const streak = calculateStreak(log.date);
  const compliance = maxPoints > 0 ? Math.round((log.totalPoints / maxPoints) * 100) : 0;

  // Prepare data for small chart
  const chartData = history.map(h => ({
    name: h.date.split('-')[2], // Day
    points: h.totalPoints
  })).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Compliance Box */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tingkat Kepatuhan</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-serif font-bold text-emerald-600">{compliance}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 max-w-[120px]">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all duration-1000" 
              style={{ width: `${compliance}%` }}
            ></div>
          </div>
        </div>
        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 relative z-10 shadow-sm">
          <Activity size={24} />
        </div>
      </div>

      {/* Points Box */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-2 -mt-2"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Poin</p>
          <span className="text-4xl font-serif font-bold text-blue-600">{log.totalPoints}</span>
          <p className="text-[10px] text-slate-400 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">Target: {maxPoints}</p>
        </div>
        <div className="h-16 w-24 relative z-10">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip cursor={false} contentStyle={{display: 'none'}} />
              <Area type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPoints)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Box */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Streak</p>
          <span className="text-4xl font-serif font-bold text-amber-500">{streak}</span>
          <p className="text-xs text-slate-400 mt-1 font-medium">Hari berturut-turut</p>
        </div>
        <div className="p-3 bg-amber-100 rounded-xl text-amber-500 relative z-10 shadow-sm">
          <Flame size={24} fill="currentColor" className="text-amber-500" />
        </div>
      </div>
    </div>
  );
};
