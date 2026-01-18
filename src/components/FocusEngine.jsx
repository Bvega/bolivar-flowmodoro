import React, { useState, useEffect } from 'react';

const FocusEngine = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FLOW'); 
  const [distractions, setDistractions] = useState({ digital: 0, person: 0, external: 0, other: 0 });
  const [history, setHistory] = useState([]);

  // 1. Load history with "Schema Protection"
  useEffect(() => {
    const saved = localStorage.getItem('bolivar_flow_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure every entry has a valid breakdown object to prevent crashes
        const validated = parsed.map(entry => ({
          ...entry,
          breakdown: entry.breakdown || { digital: 0, person: 0, external: 0, other: 0 }
        }));
        setHistory(validated);
      } catch (e) {
        console.error("Failed to parse history", e);
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => (mode === 'BREAK' ? (prev > 0 ? prev - 1 : 0) : prev + 1));
      }, 1000);
    }
    
    if (mode === 'BREAK' && seconds === 0 && isActive) {
      setIsActive(false);
      setMode('FLOW');
      alert("Restoration complete. Ready for deep work?");
    }
    return () => clearInterval(interval);
  }, [isActive, mode, seconds]);

  const logDistraction = (type) => {
    setDistractions(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your productivity history?")) {
      setHistory([]);
      localStorage.removeItem('bolivar_flow_history');
    }
  };

  const handleEndFlow = () => {
    if (mode === 'FLOW') {
      setIsActive(false);
      const workDuration = seconds;
      const totalDistractions = Object.values(distractions).reduce((a, b) => a + b, 0);
      
      const breakDuration = Math.floor(workDuration * 0.20); 
      const pulseScore = Math.min(100, Math.max(0, (workDuration / 3600) * 100 - (totalDistractions * 5)));

      const newEntry = {
        pulse: pulseScore.toFixed(1),
        duration: Math.floor(workDuration / 60),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        breakdown: { ...distractions }
      };

      const updatedHistory = [newEntry, ...history].slice(0, 10); 
      setHistory(updatedHistory);
      localStorage.setItem('bolivar_flow_history', JSON.stringify(updatedHistory));

      setSeconds(breakDuration);
      setMode('BREAK');
      if (breakDuration > 0) setIsActive(true);
    } else {
      setIsActive(false);
      setMode('FLOW');
      setSeconds(0);
      setDistractions({ digital: 0, person: 0, external: 0, other: 0 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans">
      <h1 className="text-blue-600 text-3xl font-light mb-4 tracking-tighter uppercase">
        {mode === 'FLOW' ? 'Deep Work' : 'Restoration'}
      </h1>

      <div className="text-9xl font-mono text-slate-800 mb-10 tabular-nums">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex gap-4 mb-10">
        <button onClick={() => setIsActive(!isActive)} className="bg-emerald-500 text-white px-10 py-3 rounded-full shadow-lg active:scale-95 transition">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleEndFlow} className="bg-red-500 text-white px-10 py-3 rounded-full shadow-lg active:scale-95 transition">
          {mode === 'FLOW' ? 'End & Break' : 'Finish'}
        </button>
      </div>

      {mode === 'FLOW' && (
        <div className="mb-10 w-full max-w-md">
          <p className="text-center text-slate-400 text-xs font-bold uppercase mb-3">Log Interruption</p>
          <div className="grid grid-cols-2 gap-2">
            {['digital', 'person', 'external', 'other'].map(type => (
              <button key={type} onClick={() => logDistraction(type)} className="bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-xs capitalize hover:bg-slate-100 transition">
                {type} {distractions[type] > 0 && `(${distractions[type]})`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Recent Pulses</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-red-300 hover:text-red-500 text-[10px] uppercase font-bold">Clear All</button>
          )}
        </div>
        
        {history.length === 0 ? (
          <p className="text-slate-300 text-sm italic text-center">No data recorded.</p>
        ) : (
          history.map((item, i) => (
            <div key={i} className="py-3 border-b border-slate-50 last:border-0">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-xs font-bold">{item.timestamp} — {item.duration}m</span>
                <span className="text-slate-900 font-mono font-bold">Pulse: {item.pulse}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {/* 2. Added Safe Check for breakdown logic */}
                {item.breakdown && Object.entries(item.breakdown).map(([k, v]) => v > 0 && (
                  <span key={k} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{k[0].toUpperCase()}: {v}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FocusEngine;
