import React, { useState } from 'react';

export const HintsTab = ({ data, lang }) => {
  const [hintId, setHintId] = useState(null);
  const [step, setStep] = useState(0); 
  
  const hints = data.hints[lang];
  const active = hints.find(h => h.Number === hintId);

  if (active) {
    return (
      <div className="animate-in slide-in-from-right duration-200 space-y-4">
        <button onClick={() => setHintId(null)} className="text-amber-600 font-bold flex items-center gap-1 text-sm uppercase">
          ← До списку підказок
        </button>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-amber-500 font-mono text-xs mb-1">№{active.Number}</div>
          <p className="font-bold text-lg mb-6 leading-tight text-white">{active.Problem}</p>
          
          <div className="space-y-3">
            {step >= 1 && <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-blue-500 text-sm animate-in fade-in"><strong>Підказка 1:</strong> {active['Tip 1']}</div>}
            {step >= 2 && <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-blue-500 text-sm animate-in fade-in"><strong>Підказка 2:</strong> {active['Tip 2']}</div>}
            {step >= 3 && <div className="p-4 bg-green-900/20 rounded-lg border border-green-900/50 text-green-100 italic text-sm animate-in zoom-in-95"><strong>Рішення:</strong> {active.Solution}</div>}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-8">
            <button disabled={step >= 1} onClick={() => setStep(1)} className="bg-slate-800 p-2 rounded text-[10px] font-bold disabled:opacity-20 border border-slate-700 uppercase">Hint 1</button>
            <button disabled={step >= 2} onClick={() => setStep(2)} className="bg-slate-800 p-2 rounded text-[10px] font-bold disabled:opacity-20 border border-slate-700 uppercase">Hint 2</button>
            <button disabled={step >= 3} onClick={() => setStep(3)} className="bg-green-900/40 p-2 rounded text-[10px] font-black disabled:opacity-20 border border-green-800 uppercase">Solution</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/50">
      {hints.map(h => (
        <button key={h.Number} onClick={() => {setHintId(h.Number); setStep(0);}} className="w-full text-left py-4 px-2 hover:bg-slate-900/50 active:bg-slate-900 flex gap-4 items-baseline transition-colors">
          <span className="text-amber-600 font-mono font-bold text-xs">#{h.Number}</span>
          <span className="text-sm text-slate-300">{h.Problem}</span>
        </button>
      ))}
    </div>
  );
};