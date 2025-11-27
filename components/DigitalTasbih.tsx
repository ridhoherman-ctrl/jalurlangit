
import React, { useState, useEffect } from 'react';
import { X, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  target?: number;
  title: string;
}

export const DigitalTasbih: React.FC<Props> = ({ isOpen, onClose, target, title }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isOpen) setCount(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTap = () => {
    // Vibrate if supported (Haptic Feedback)
    if (navigator.vibrate) navigator.vibrate(5);
    
    if (target && count >= target) return;
    setCount(prev => prev + 1);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Ulangi hitungan?')) {
        setCount(0);
    }
  };

  const isComplete = target ? count >= target : false;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-serif font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Counter Area - Clickable */}
        <div 
            onClick={handleTap}
            className={`
                h-80 flex flex-col items-center justify-center cursor-pointer select-none transition-colors duration-300 relative
                ${isComplete ? 'bg-emerald-50' : 'bg-white active:bg-slate-50'}
            `}
        >
            {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <CheckCircle2 size={200} className="text-emerald-500" />
                </div>
            )}

            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                {isComplete ? 'Target Tercapai' : 'Ketuk Layar'}
            </div>
            
            <div className={`text-9xl font-mono font-bold transition-all duration-100 transform ${isComplete ? 'text-emerald-600 scale-110' : 'text-slate-800 active:scale-95'}`}>
                {count}
            </div>
            
            {target && (
                <div className="mt-4 text-slate-500 font-medium bg-slate-100 px-4 py-1 rounded-full">
                    Target: {target}
                </div>
            )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
            <button 
                onClick={handleReset}
                className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
                <RotateCcw size={18} />
                <span className="text-sm font-bold">Reset</span>
            </button>
            
            <button 
                onClick={onClose}
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
                Selesai
            </button>
        </div>
      </div>
    </div>
  );
};
