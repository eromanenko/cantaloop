import React from 'react';

export const TriggersTab = ({ activeTriggers, onToggle, t }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95">
      <h2 className="text-center font-black uppercase tracking-widest text-slate-400 text-[10px] mb-4">
        {t('checklist_title')}
      </h2>
      
      <div className="grid grid-cols-10 gap-1.5 items-center">
        <div></div>
        {cols.map(c => <div key={c} className="text-center text-[10px] font-black text-slate-300">{c}</div>)}

        {rows.map(r => (
          <React.Fragment key={r}>
            <div className="text-center text-xs font-black text-slate-400 py-1">{r}</div>
            {cols.map(c => {
              const id = `${r}${c}`;
              const isActive = activeTriggers.includes(id);
              return (
                <button
                  key={id} onClick={() => onToggle(id)}
                  className={`aspect-square rounded-md border-2 flex items-center justify-center transition-all active:scale-90 ${
                    isActive ? 'bg-amber-500 border-amber-600 text-white' : 'bg-slate-50 border-slate-200 text-transparent'
                  }`}
                >
                  <span className="text-[10px] font-black italic select-none">X</span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-6">
        <p className="text-[9px] text-slate-500 text-center italic leading-tight">
          {t('checklist_note')}
        </p>
      </div>
    </div>
  );
};