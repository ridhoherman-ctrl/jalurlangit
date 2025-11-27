
import React, { useEffect, useState } from 'react';
import { DailyLog, Category } from '../types';
import * as Storage from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { compareDesc } from 'date-fns';

export const Statistics: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [ibadahList] = useState(Storage.getIbadahList());

  useEffect(() => {
    const allLogs = Storage.getAllLogs();
    const sortedLogs = Object.values(allLogs).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
    setLogs(sortedLogs);
  }, []);

  // Aggregate Data
  const totalPoints = logs.reduce((acc, log) => acc + log.totalPoints, 0);
  const totalCompleted = logs.reduce((acc, log) => acc + log.completedIds.length, 0);
  const activeDays = logs.filter(l => l.totalPoints > 0).length;

  // Breakdown by Category
  const categoryStats = logs.reduce((acc, log) => {
    log.completedIds.forEach(id => {
      const item = ibadahList.find(i => i.id === id);
      if (item) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<Category, number>);

  const barData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <h2 className="text-2xl font-serif font-bold text-emerald-900">Statistik Ibadah</h2>

      {/* Big Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center">
          <p className="text-slate-500 mb-2">Total Akumulasi Poin</p>
          <p className="text-4xl font-bold text-emerald-600">{totalPoints}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center">
          <p className="text-slate-500 mb-2">Total Ibadah Selesai</p>
          <p className="text-4xl font-bold text-blue-600">{totalCompleted}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center">
          <p className="text-slate-500 mb-2">Hari Aktif</p>
          <p className="text-4xl font-bold text-orange-600">{activeDays}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h3 className="font-bold text-emerald-900 mb-6">Breakdown per Kategori</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} name="Jumlah Selesai" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-6 border-b border-emerald-100">
           <h3 className="font-bold text-emerald-900">Riwayat Refleksi Harian</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Mood</th>
                <th className="px-6 py-3">Refleksi</th>
                <th className="px-6 py-3">Syukur</th>
                <th className="px-6 py-3">Harapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.slice(0, 10).map(log => (
                <tr key={log.date} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(log.date))}
                  </td>
                  <td className="px-6 py-4 text-2xl">{log.mood || '-'}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={log.reflection}>{log.reflection || '-'}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={log.gratitude}>{log.gratitude || '-'}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={log.hope}>{log.hope || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada data riwayat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
