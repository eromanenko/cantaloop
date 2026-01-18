import React, { useMemo } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { TextFormatter } from '../Shared/TextFormatter';

export const CodesTab = ({ data, lang, activeCode, setActiveCode }) => {
  const [locId, setLocId] = usePersistentState('current_loc', '1');
  const currentCodes = data.codes[lang];
  const locations = data.dict.filter(i => i.Table === 'location');

  /* Sort codes alphabetically for easier navigation */
  const filtered = useMemo(() => 
    currentCodes.filter(c => c.Location === locId).sort((a, b) => a.Code.localeCompare(b.Code))
  , [locId, lang, currentCodes]);

  const activeItem = activeCode ? currentCodes.find(c => c.Code.toLowerCase() === activeCode.toLowerCase()) : null;

  if (activeItem) {
    return (
      <div className="bg-white p-6 rounded-2xl border-2 border-amber-500 shadow-xl animate-in zoom-in-95 duration-200">
        <h2 className="text-amber-800 font-black mb-2 uppercase tracking-tighter text-xs">
          {activeItem.Code} {activeItem.Object ? `• ${activeItem.Object}` : ''}
        </h2>
        <div className="text-xl leading-relaxed italic text-slate-900 font-serif border-t border-amber-100 pt-4">
          <TextFormatter text={activeItem.Text} onCodeClick={setActiveCode}/>
        </div>
        <button 
          onClick={() => setActiveCode(null)} 
          className="mt-8 w-full bg-slate-900 text-white hover:bg-black py-4 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-lg"
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
        className="w-full bg-white p-3 rounded-xl border border-slate-300 text-slate-900 outline-none appearance-none"
      >
        {locations.map(l => <option key={l.Id} value={l.Id}>{l[lang]}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-3">
        {filtered.map(c => (
          <button 
            key={c.Code} 
            onClick={() => setActiveCode(c.Code)} 
            className="bg-white p-4 rounded-xl border border-slate-200 text-amber-800 font-mono text-sm font-bold hover:border-amber-500 hover:shadow-md active:bg-amber-50 transition-all shadow-sm"
          >
            {c.Code}
          </button>
        ))}
      </div>
    </div>
  );
};