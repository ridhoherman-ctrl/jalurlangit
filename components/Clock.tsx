import React, { useState, useEffect } from 'react';
import { TimeZone } from '../types';
import { Clock as ClockIcon } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [zone, setZone] = useState<TimeZone>('WIB');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getOffset = (z: TimeZone) => {
    switch (z) {
      case 'WIB': return 7;
      case 'WITA': return 8;
      case 'WIT': return 9;
    }
  };

  const getFormattedTime = () => {
    // Convert current UTC time to target zone
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (3600000 * getOffset(zone)));
    
    return targetTime.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="flex items-center space-x-2 bg-emerald-800 text-white px-4 py-2 rounded-full shadow-lg">
      <ClockIcon size={18} />
      <span className="font-mono text-xl font-bold min-w-[100px] text-center">{getFormattedTime()}</span>
      <select 
        value={zone} 
        onChange={(e) => setZone(e.target.value as TimeZone)}
        className="bg-emerald-900 border-none text-xs rounded p-1 cursor-pointer focus:ring-0"
      >
        <option value="WIB">WIB</option>
        <option value="WITA">WITA</option>
        <option value="WIT">WIT</option>
      </select>
    </div>
  );
};
