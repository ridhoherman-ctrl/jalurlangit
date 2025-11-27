import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Settings as SettingsIcon, Moon } from 'lucide-react';

import { Dashboard } from './views/Dashboard';
import { Statistics } from './views/Statistics';
import { Settings } from './views/Settings';
import { Clock } from './components/Clock';
import { getUserSettings } from './services/storageService';

const App: React.FC = () => {
  const user = getUserSettings();

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Moon fill="white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-emerald-950 leading-tight">Jalur Langit</h1>
                <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Daily Tracker</p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <Clock />
            </div>
          </div>
        </header>

        {/* Greeting Banner */}
        <div className="bg-emerald-900 text-white py-8 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Assalammualaikum, {user.name}!
            </h2>
            <p className="text-emerald-100 opacity-90 text-sm md:text-base max-w-2xl">
              Semoga Hari Ini Penuh Berkah dan Ibadahmu di Terima oleh ALLAH SWT.
            </p>
            <div className="md:hidden mt-4">
               <Clock />
            </div>
          </div>
        </div>

        {/* Navigation Mobile/Desktop */}
        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 md:sticky md:top-16 md:border-none md:bg-transparent md:z-40">
           <div className="max-w-5xl mx-auto px-4">
             <div className="flex md:space-x-2 justify-around md:justify-start md:py-4 bg-white md:bg-transparent">
                <NavLink to="/" className={({ isActive }) => `flex flex-col md:flex-row items-center p-3 md:px-5 md:py-2.5 rounded-xl transition-all ${isActive ? 'text-emerald-600 md:bg-emerald-600 md:text-white md:shadow-lg md:shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}>
                  <LayoutDashboard size={20} className="mb-1 md:mb-0 md:mr-2" />
                  <span className="text-[10px] md:text-sm font-bold">Dashboard</span>
                </NavLink>
                
                <NavLink to="/stats" className={({ isActive }) => `flex flex-col md:flex-row items-center p-3 md:px-5 md:py-2.5 rounded-xl transition-all ${isActive ? 'text-emerald-600 md:bg-emerald-600 md:text-white md:shadow-lg md:shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}>
                  <PieChart size={20} className="mb-1 md:mb-0 md:mr-2" />
                  <span className="text-[10px] md:text-sm font-bold">Statistik</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `flex flex-col md:flex-row items-center p-3 md:px-5 md:py-2.5 rounded-xl transition-all ${isActive ? 'text-emerald-600 md:bg-emerald-600 md:text-white md:shadow-lg md:shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}>
                  <SettingsIcon size={20} className="mb-1 md:mb-0 md:mr-2" />
                  <span className="text-[10px] md:text-sm font-bold">Kelola</span>
                </NavLink>
             </div>
           </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

      </div>
    </HashRouter>
  );
};

export default App;
