import React from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { TextFormatter } from '../Shared/TextFormatter';

export const DialogsTab = ({ data, lang, onCodeClick }) => {
  const [sceneId, setSceneId] = usePersistentState('current_scene', '');
  
  const scenes = data.dict.filter(item => item.Table === 'scene');
  const filtered = data.dialogs.filter(d => d.Scene === sceneId);

  const groups = filtered.reduce((acc, item) => {
    const trigger = item.Trigger || 'base';
    if (!acc[trigger]) acc[trigger] = [];
    acc[trigger].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <select 
        value={sceneId} 
        onChange={e => setSceneId(e.target.value)}
        className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none focus:border-amber-500 transition-all"
      >
        <option value="">Оберіть сцену...</option>
        {scenes.map(s => <option key={s.Id} value={s.Id}>{s[lang]}</option>)}
      </select>

      {Object.entries(groups).map(([trigger, lines]) => (
        <div key={trigger} className={trigger !== 'base' ? "mt-6 border-l-2 border-dashed border-amber-900/50 pl-4" : ""}>
          {trigger !== 'base' && (
            <div className="text-[10px] font-black text-amber-600 uppercase mb-2 tracking-widest">
              Тригер: {trigger}
            </div>
          )}
          {lines.map((l, i) => (
            <div key={i} className="mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter ml-1">
                {l.Person}
              </div>
              <div className="bg-slate-900/50 p-3 rounded-2xl rounded-tl-none border border-slate-800/50 text-slate-200 shadow-sm">
                <TextFormatter text={l[lang]} onCodeClick={onCodeClick} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};