import React, { useMemo } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { TextFormatter } from '../Shared/TextFormatter';

export const CodesTab = ({ data, lang, activeCode, setActiveCode }) => {
  const [locId, setLocId] = usePersistentState('current_loc', '1');
  const currentCodes = data.codes[lang];
  const locations = data.dict.filter(i => i.Table === 'location');

  const filtered = useMemo(() => 
    currentCodes.filter(c => c.Location === locId).sort((a, b) => a.Code.localeCompare(b.Code))
  , [locId, lang, currentCodes]);

  const activeItem = activeCode ? currentCodes.find(c => c.Code.toLowerCase() === activeCode.toLowerCase()) : null;

  if (activeItem) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl border-2 border-amber-600 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-amber-500 font-bold mb-2 uppercase tracking-tighter text-sm">
          {activeItem.Code} {activeItem.Object ? `• ${activeItem.Object}` : ''}
        </h3>
        <p className="text-xl leading-relaxed italic text-slate-100 font-serif">
          <TextFormatter text={activeItem.Text} onCodeClick={setActiveCode}/>
        </p>
        <button 
          onClick={() => setActiveCode(null)} 
          className="mt-8 w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-black text-xs tracking-widest border border-slate-700 transition-all active:scale-95"
        >
          ← ПОВЕРНУТИСЬ ДО СПИСКУ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <select 
        value={locId} 
        onChange={e => setLocId(e.target.value)} 
        className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none"
      >
        {locations.map(l => <option key={l.Id} value={l.Id}>{l[lang]}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-2">
        {filtered.map(c => (
          <button 
            key={c.Code} 
            onClick={() => setActiveCode(c.Code)} 
            className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-amber-500 font-mono text-sm hover:border-amber-500 active:bg-amber-600 active:text-white transition-all shadow-md"
          >
            {c.Code}
          </button>
        ))}
      </div>
    </div>
  );
};