import React, { useState } from 'react';
import { Moon, ArrowRight } from 'lucide-react';
import { saveUserSettings } from '../services/storageService';

interface Props {
  onComplete: () => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveUserSettings({ name: name.trim() });
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
       <div className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
       </div>
       <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600 rounded-full filter blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500 rounded-full filter blur-[100px] opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 transform rotate-3">
            <Moon className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Ahlan Wa Sahlan</h1>
          <p className="text-emerald-100/80 font-light text-sm leading-relaxed">
            Selamat datang di <span className="text-amber-300 font-semibold">Jalur Langit Tracker</span>. Mari mulai perjalanan ibadahmu dengan perkenalan singkat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold text-emerald-200 uppercase tracking-widest ml-1">Nama Panggilan</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-4 text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-center font-serif"
              placeholder="Siapa namamu?"
              autoFocus
              required
              autoComplete="off"
            />
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span>Mulai Perjalanan</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-6 text-center w-full">
         <p className="text-emerald-800/60 text-xs font-mono tracking-widest uppercase">Bismillah, Niatkan karena Allah</p>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
