import React from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { TextFormatter } from '../Shared/TextFormatter';

export const DialogsTab = ({ data, lang, onCodeClick }) => {
  const [sceneId, setSceneId] = usePersistentState('current_scene', '');
  
  const scenes = data.dict.filter(item => item.Table === 'scene');
  const filtered = data.dialogs.filter(d => d.Scene === sceneId);

  /* Group dialog lines by their trigger ID */
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
        className="w-full bg-white p-3 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
      >
        <option value="">Оберіть сцену...</option>
        {scenes.map(s => <option key={s.Id} value={s.Id}>{s[lang]}</option>)}
      </select>

      {Object.entries(groups).map(([trigger, lines]) => (
        <div key={trigger} className={trigger !== 'base' ? "mt-6 border-l-4 border-amber-200 pl-4 bg-amber-50/30 py-2 rounded-r-lg" : ""}>
          {trigger !== 'base' && (
            <div className="text-[10px] font-black text-amber-700 uppercase mb-2 tracking-widest px-2">
              Якщо спрацював тригер: {trigger}
            </div>
          )}
          {lines.map((l, i) => (
            <div key={i} className="mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="text-[10px] font-black text-blue-700 uppercase tracking-tighter ml-2 mb-1">
                {l.Person}
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 text-slate-800 shadow-sm leading-relaxed">
                <TextFormatter text={l[lang]} onCodeClick={onCodeClick} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};