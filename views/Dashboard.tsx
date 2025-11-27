
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IbadahItem, DailyLog, Category } from '../types';
import * as Storage from '../services/storageService';
import { StatsSummary } from '../components/StatsSummary';
import { ReflectionBox } from '../components/ReflectionBox';
import { Check, CalendarOff, BookOpen } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [ibadahList, setIbadahList] = useState<IbadahItem[]>([]);
  const [log, setLog] = useState<DailyLog>(Storage.getDailyLog(format(new Date(), 'yyyy-MM-dd')));
  const [history, setHistory] = useState<DailyLog[]>([]);
  const [exclusion, setExclusion] = useState(Storage.isDateExcluded(new Date()));

  useEffect(() => {
    setIbadahList(Storage.getIbadahList());
    
    // Load last 7 days history
    const hist = [];
    for(let i=1; i<=7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        hist.push(Storage.getDailyLog(format(d, 'yyyy-MM-dd')));
    }
    setHistory(hist);
  }, []);

  const handleToggle = (item: IbadahItem) => {
    if (exclusion) return; // Prevent toggle if excluded

    const newCompleted = log.completedIds.includes(item.id)
      ? log.completedIds.filter(id => id !== item.id)
      : [...log.completedIds, item.id];

    // Recalculate points
    const newPoints = newCompleted.reduce((acc, id) => {
      const ibadah = ibadahList.find(i => i.id === id);
      return acc + (ibadah ? ibadah.points : 0);
    }, 0);

    const updatedLog = {
      ...log,
      completedIds: newCompleted,
      totalPoints: newPoints
    };

    setLog(updatedLog);
    Storage.saveDailyLog(updatedLog);

    // Notification trigger (Simple)
    if (!log.completedIds.includes(item.id)) {
       if (Notification.permission === "granted") {
         new Notification("Alhamdulillah!", { body: `${item.name} tercatat.` });
       } else if (Notification.permission !== "denied") {
         Notification.requestPermission();
       }
    }
  };

  const handleQuranUpdate = (field: 'surah' | 'ayat', value: string) => {
    const current = log.quranLastRead || { surah: '', ayat: '' };
    const updatedLog = {
      ...log,
      quranLastRead: { ...current, [field]: value }
    };
    setLog(updatedLog);
    Storage.saveDailyLog(updatedLog);
  };

  const handleReflectionUpdate = (updates: Partial<DailyLog>) => {
    const updatedLog = { ...log, ...updates };
    setLog(updatedLog);
    Storage.saveDailyLog(updatedLog);
  };

  const categories: Category[] = [
    'Dzikir dan Doa',
    'Puasa Sunnah',
    'Sedekah',
    'Sholat Sunnah',
    'Sholat Wajib',
    'Tilawah Al Qur’an'
  ];

  const maxPoints = ibadahList.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      
      {/* Date Header with Pattern */}
      <div className="relative overflow-hidden rounded-2xl bg-emerald-900 text-white p-6 md:p-8 shadow-xl">
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-300">
                Checklist Ibadah
              </h2>
              <p className="text-emerald-100 mt-1 opacity-90">
                "Barangsiapa yang menempuh jalan untuk menuntut ilmu, Allah akan mudahkan baginya jalan menuju surga."
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="font-mono text-lg font-bold text-white">
                {new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
              </span>
            </div>
         </div>
      </div>

      <StatsSummary log={log} maxPoints={maxPoints} history={history} />

      {exclusion && (
        <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl flex items-center space-x-3 text-pink-800 mb-6 animate-pulse">
          <CalendarOff />
          <div>
            <p className="font-bold">Mode Pengecualian Aktif</p>
            <p className="text-sm">Anda sedang dalam masa {exclusion.reason}. Checklist dinonaktifkan. Istirahatlah dengan niat yang baik.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist Column */}
        <div className="lg:col-span-2 space-y-8">
          {categories.map((cat) => {
            const items = ibadahList.filter(i => i.category === cat);
            if (items.length === 0) return null;
            
            return (
              <div key={cat} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                  <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
                    {cat}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    {items.length} Ibadah
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {items.map(item => {
                    const isChecked = log.completedIds.includes(item.id);
                    const isQuran = item.category === 'Tilawah Al Qur’an';
                    
                    return (
                      <div key={item.id} className={`transition-all duration-300 ${isChecked ? 'bg-slate-50/50' : 'bg-white'}`}>
                        <div 
                          onClick={() => handleToggle(item)}
                          className={`p-5 flex items-start space-x-4 cursor-pointer hover:bg-slate-50 ${exclusion ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <div className={`flex-shrink-0 mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                            isChecked 
                              ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200' 
                              : 'border-slate-300 text-transparent hover:border-emerald-400'
                          }`}>
                            <Check size={14} strokeWidth={4} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className={`font-semibold text-lg transition-all duration-300 ${
                                isChecked 
                                  ? 'text-slate-400 line-through decoration-emerald-500/50 decoration-2' 
                                  : 'text-emerald-950'
                              }`}>
                                {item.name}
                              </h4>
                              <span className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                                isChecked ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-700'
                              }`}>
                                +{item.points} Poin
                              </span>
                            </div>
                            <p className={`text-sm mt-1 transition-colors ${isChecked ? 'text-slate-300' : 'text-slate-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Quran Specific Input */}
                        {isQuran && (
                          <div className={`px-5 pb-5 ml-14 transition-all duration-500 overflow-hidden ${isChecked ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                             <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex flex-col sm:flex-row gap-3 items-center">
                                <div className="text-amber-600">
                                  <BookOpen size={20} />
                                </div>
                                <div className="flex-1 w-full sm:w-auto">
                                  <label className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Surat Terakhir</label>
                                  <input 
                                    type="text" 
                                    placeholder="Contoh: Al-Baqarah"
                                    value={log.quranLastRead?.surah || ''}
                                    onChange={(e) => handleQuranUpdate('surah', e.target.value)}
                                    className="w-full bg-white border-none rounded-lg text-sm text-emerald-900 placeholder-amber-300 focus:ring-1 focus:ring-amber-400 py-1"
                                  />
                                </div>
                                <div className="w-full sm:w-24">
                                  <label className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Ayat</label>
                                  <input 
                                    type="text" 
                                    placeholder="10-15"
                                    value={log.quranLastRead?.ayat || ''}
                                    onChange={(e) => handleQuranUpdate('ayat', e.target.value)}
                                    className="w-full bg-white border-none rounded-lg text-sm text-emerald-900 placeholder-amber-300 focus:ring-1 focus:ring-amber-400 py-1"
                                  />
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          <ReflectionBox log={log} onUpdate={handleReflectionUpdate} />
          
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BookOpen size={100} />
             </div>
             <h3 className="font-serif text-xl font-bold mb-3 text-amber-300">Quote Hari Ini</h3>
             <p className="italic opacity-90 leading-relaxed font-light text-emerald-50 text-sm">
               "Amalan yang paling dicintai oleh Allah adalah amalan yang langgeng (terus-menerus) meskipun sedikit."
             </p>
             <div className="w-12 h-1 bg-amber-500 rounded-full mt-4 mb-2"></div>
             <p className="text-right text-xs font-bold text-amber-300 tracking-widest uppercase">- HR. Bukhari & Muslim</p>
          </div>
        </div>
      </div>
    </div>
  );
};
