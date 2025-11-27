
import React, { useState, useEffect, useRef } from 'react';
import { IbadahItem, ExclusionPeriod, Category, ExclusionReason } from '../types';
import * as Storage from '../services/storageService';
import { Trash2, Plus, AlertCircle, Download, Upload, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ibadah' | 'halangan' | 'data'>('ibadah');
  
  // Ibadah Form State
  const [ibadahList, setIbadahList] = useState<IbadahItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<IbadahItem>>({ category: 'Sholat Sunnah', points: 0 });

  // Exclusion Form State
  const [exclusions, setExclusions] = useState<ExclusionPeriod[]>([]);
  const [newExclusion, setNewExclusion] = useState<Partial<ExclusionPeriod>>({ reason: 'Haid' });

  // Data State
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIbadahList(Storage.getIbadahList());
    setExclusions(Storage.getExclusions());
  }, []);

  const handleAddIbadah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.points) return;
    
    const item: IbadahItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category as Category,
      description: newItem.description || '',
      target: newItem.target || '-',
      points: Number(newItem.points),
      isCustom: true
    };

    const updated = [...ibadahList, item];
    setIbadahList(updated);
    Storage.saveIbadahList(updated);
    setNewItem({ category: 'Sholat Sunnah', points: 0, name: '', description: '', target: '' });
  };

  const handleDeleteIbadah = (id: string) => {
    if(confirm('Hapus jenis ibadah ini?')) {
        const updated = ibadahList.filter(i => i.id !== id);
        setIbadahList(updated);
        Storage.saveIbadahList(updated);
    }
  };

  const handleAddExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExclusion.startDate || !newExclusion.endDate) return;

    const ex: ExclusionPeriod = {
      id: Date.now().toString(),
      startDate: newExclusion.startDate,
      endDate: newExclusion.endDate,
      reason: newExclusion.reason as ExclusionReason,
      note: newExclusion.note || ''
    };

    const updated = [...exclusions, ex];
    setExclusions(updated);
    Storage.saveExclusions(updated);
    setNewExclusion({ reason: 'Haid', startDate: '', endDate: '', note: '' });
  };

  const handleDeleteExclusion = (id: string) => {
    const updated = exclusions.filter(e => e.id !== id);
    setExclusions(updated);
    Storage.saveExclusions(updated);
  };

  const handleExport = () => {
    const json = Storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `JalurLangit_Backup_${format(new Date(), 'yyyyMMdd_HHmm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      if (Storage.importData(json)) {
        alert('Data berhasil dipulihkan!');
        window.location.reload();
      } else {
        alert('Gagal memproses file backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('PERINGATAN: Ini akan menghapus SEMUA data ibadah dan kembali ke pengaturan awal. Anda tidak bisa membatalkannya. Lanjutkan?')) {
        localStorage.clear();
        window.location.reload();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6">Kelola Aplikasi</h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('ibadah')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeTab === 'ibadah' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kelola Jenis Ibadah
        </button>
        <button 
          onClick={() => setActiveTab('halangan')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeTab === 'halangan' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kelola Halangan
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeTab === 'data' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Backup & Data
        </button>
      </div>

      {activeTab === 'ibadah' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Add Form */}
          <form onSubmit={handleAddIbadah} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
               <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                 <Plus size={18} /> Tambah Jenis Ibadah Baru
               </h3>
             </div>
             
             <input required placeholder="Nama Ibadah" className="input-std" 
               value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
             
             <select className="input-std" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
                <option value="Dzikir dan Doa">Dzikir dan Doa</option>
                <option value="Puasa Sunnah">Puasa Sunnah</option>
                <option value="Sedekah">Sedekah</option>
                <option value="Sholat Sunnah">Sholat Sunnah</option>
                <option value="Sholat Wajib">Sholat Wajib</option>
                <option value="Tilawah Al Qur’an">Tilawah Al Qur’an</option>
             </select>

             <input placeholder="Deskripsi" className="input-std" 
               value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})} />
             
             <input placeholder="Target (e.g., 1 Juz)" className="input-std" 
               value={newItem.target || ''} onChange={e => setNewItem({...newItem, target: e.target.value})} />
             
             <input required type="number" placeholder="Poin Reward" className="input-std" 
               value={newItem.points || ''} onChange={e => setNewItem({...newItem, points: parseInt(e.target.value)})} />
             
             <div className="md:col-span-2 text-right">
               <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                 Simpan Ibadah
               </button>
             </div>
          </form>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Poin</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ibadahList.map(item => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-emerald-900">{item.name}</td>
                    <td className="px-6 py-3 text-slate-500">{item.category}</td>
                    <td className="px-6 py-3 font-bold text-emerald-600">+{item.points}</td>
                    <td className="px-6 py-3">
                       <button onClick={() => handleDeleteIbadah(item.id)} className="text-red-500 hover:text-red-700">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'halangan' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-orange-50 p-4 rounded-xl flex gap-3 text-orange-800 text-sm">
            <AlertCircle className="flex-shrink-0" />
            <p>Catat periode dimana Anda tidak dapat melaksanakan ibadah (seperti Haid/Nifas/Sakit). Periode ini akan ditandai di kalender statistik.</p>
          </div>

          <form onSubmit={handleAddExclusion} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
               <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                 <Plus size={18} /> Tambah Periode Pengecualian
               </h3>
             </div>
             
             <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Mulai</label>
               <input required type="date" className="input-std" 
                 value={newExclusion.startDate || ''} onChange={e => setNewExclusion({...newExclusion, startDate: e.target.value})} />
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Berakhir</label>
               <input required type="date" className="input-std" 
                 value={newExclusion.endDate || ''} onChange={e => setNewExclusion({...newExclusion, endDate: e.target.value})} />
             </div>
             
             <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-500 mb-1">Alasan</label>
               <select className="input-std" value={newExclusion.reason} onChange={e => setNewExclusion({...newExclusion, reason: e.target.value as ExclusionReason})}>
                  <option value="Haid">Haid</option>
                  <option value="Nifas">Nifas</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Lainnya">Lainnya</option>
               </select>
             </div>

             <div className="md:col-span-2">
                <input placeholder="Catatan Tambahan (Opsional)" className="input-std" 
                 value={newExclusion.note || ''} onChange={e => setNewExclusion({...newExclusion, note: e.target.value})} />
             </div>
             
             <div className="md:col-span-2 text-right">
               <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                 Tambah Periode
               </button>
             </div>
          </form>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Periode</th>
                  <th className="px-6 py-3">Alasan</th>
                  <th className="px-6 py-3">Catatan</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {exclusions.map(item => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {format(new Date(item.startDate), 'dd MMM')} - {format(new Date(item.endDate), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-bold">{item.reason}</span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{item.note || '-'}</td>
                    <td className="px-6 py-3">
                       <button onClick={() => handleDeleteExclusion(item.id)} className="text-red-500 hover:text-red-700">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
                {exclusions.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400">Tidak ada data pengecualian.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-sm border border-blue-100">
                <AlertCircle className="flex-shrink-0" />
                <p>
                    Data Anda tersimpan di browser (LocalStorage). Jika Anda membersihkan cache atau ganti perangkat, data akan hilang. 
                    <strong> Sangat disarankan untuk rutin melakukan Backup (Download Data).</strong>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                        <Download size={24} />
                    </div>
                    <h3 className="font-bold text-emerald-900 text-lg mb-2">Backup Data</h3>
                    <p className="text-slate-500 text-sm mb-6">Unduh semua data ibadah, pengaturan, dan riwayat Anda ke dalam file JSON.</p>
                    <button onClick={handleExport} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                        Download Backup
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                        <Upload size={24} />
                    </div>
                    <h3 className="font-bold text-emerald-900 text-lg mb-2">Restore Data</h3>
                    <p className="text-slate-500 text-sm mb-6">Pulihkan data dari file backup yang sebelumnya Anda unduh.</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".json"
                        onChange={handleImportFile}
                    />
                    <button onClick={handleImportTrigger} className="w-full border-2 border-amber-500 text-amber-700 py-3 rounded-xl font-bold hover:bg-amber-50 transition-colors">
                        Upload File Backup
                    </button>
                </div>
            </div>

             <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="font-bold text-red-600 mb-4">Zona Bahaya</h3>
                <button onClick={handleResetData} className="flex items-center space-x-2 text-red-500 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <RefreshCw size={16} />
                    <span>Reset Total Aplikasi (Hapus Semua Data)</span>
                </button>
             </div>
        </div>
      )}

      <style>{`
        .input-std {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          outline: none;
        }
        .input-std:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
};
