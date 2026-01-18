import React, { useState } from 'react';

export const HintsTab = ({ data, lang }) => {
  const [hintId, setHintId] = useState(null);
  const [step, setStep] = useState(0); 
  
  const hints = data.hints[lang];
  const active = hints.find(h => h.Number === hintId);

  if (active) {
    return (
      <div className="animate-in slide-in-from-right duration-200 space-y-4">
        <button onClick={() => setHintId(null)} className="text-amber-800 font-black flex items-center gap-1 text-xs uppercase hover:underline">
          ← До списку підказок
        </button>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
          <div className="text-amber-700 font-mono text-xs mb-1 font-bold">№{active.Number}</div>
          <p className="font-black text-xl mb-8 leading-tight text-slate-900">{active.Problem}</p>
          
          <div className="space-y-4">
            {step >= 1 && <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-600 text-sm animate-in fade-in"><strong>Підказка 1:</strong> {active['Tip 1']}</div>}
            {step >= 2 && <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-600 text-sm animate-in fade-in"><strong>Підказка 2:</strong> {active['Tip 2']}</div>}
            {step >= 3 && <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-green-900 italic text-md animate-in zoom-in-95 shadow-inner"><strong>Рішення:</strong> {active.Solution}</div>}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-10">
            <button disabled={step >= 1} onClick={() => setStep(1)} className="bg-white border border-slate-300 p-3 rounded-lg text-[10px] font-black uppercase text-slate-700 disabled:opacity-20 shadow-sm">Hint 1</button>
            <button disabled={step >= 2} onClick={() => setStep(2)} className="bg-white border border-slate-300 p-3 rounded-lg text-[10px] font-black uppercase text-slate-700 disabled:opacity-20 shadow-sm">Hint 2</button>
            <button disabled={step >= 3} onClick={() => setStep(3)} className="bg-green-600 p-3 rounded-lg text-[10px] font-black uppercase text-white disabled:opacity-20 shadow-md">Solution</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
      {hints.map(h => (
        <button key={h.Number} onClick={() => {setHintId(h.Number); setStep(0);}} className="w-full text-left py-4 px-4 hover:bg-slate-50 active:bg-slate-100 flex gap-4 items-baseline transition-colors">
          <span className="text-amber-700 font-mono font-black text-xs">#{h.Number}</span>
          <span className="text-sm text-slate-700 font-medium">{h.Problem}</span>
        </button>
      ))}
    </div>
  );
};