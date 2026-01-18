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
    <div className="flex flex-col h-full space-y-4">
      {/* Sticky scene selector */}
      <div className="sticky top-0 z-10 bg-slate-50/95 py-2 backdrop-blur-sm">
        <select 
          value={sceneId} 
          onChange={e => setSceneId(e.target.value)}
          className="w-full bg-white p-3 rounded-xl border border-slate-300 text-slate-900 outline-none shadow-sm"
        >
          <option value="">Оберіть сцену...</option>
          {scenes.map(s => <option key={s.Id} value={s.Id}>{s[lang]}</option>)}
        </select>
      </div>

      {Object.entries(groups).map(([trigger, lines]) => (
        <div key={trigger} className="space-y-4">
          {trigger !== 'base' && (
            <div className="flex justify-center my-6">
              <details className="w-full group">
                <summary className="list-none cursor-pointer">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-px bg-amber-200 flex-grow"></div>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest px-3 bg-amber-50 rounded-full border border-amber-200 py-1">
                      IF TRIGGER: {trigger}
                    </span>
                    <div className="h-px bg-amber-200 flex-grow"></div>
                  </div>
                </summary>
                <div className="mt-4 space-y-4 px-2">
                  {lines.map((l, i) => <ChatLine key={i} line={l} lang={lang} onCodeClick={onCodeClick} />)}
                </div>
              </details>
            </div>
          )}
          
          {trigger === 'base' && lines.map((l, i) => (
            <ChatLine key={i} line={l} lang={lang} onCodeClick={onCodeClick} />
          ))}
        </div>
      ))}
    </div>
  );
};

const ChatLine = ({ line, lang, onCodeClick }) => {
  /* Check if Person field is empty or missing */
  const hasPerson = line.Person && line.Person.trim() !== "";
  
  if (!hasPerson) {
    return (
      <div className="narrative-text animate-in fade-in duration-700">
        <TextFormatter text={line[lang]} onCodeClick={onCodeClick} />
      </div>
    );
  }

  const isHook = line.Person.toLowerCase() === 'hook';
  const avatarPath = `/avatars/${line.Person.toLowerCase().trim()}.png`;

  return (
    <div className={`flex items-end space-x-2 mb-2 ${isHook ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
      {/* Small circular avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shadow-sm">
        <img 
          src={avatarPath} 
          alt="" 
          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?background=cbd5e1&color=64748b&name=' + line.Person; }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`flex flex-col ${isHook ? 'items-end' : 'items-start'}`}>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1 px-1">
          {line.Person}
        </span>
        <div className={`chat-bubble ${isHook ? 'bubble-hook' : 'bubble-other'} animate-in slide-in-from-bottom-1 duration-300`}>
          <TextFormatter text={line[lang]} onCodeClick={onCodeClick} />
        </div>
      </div>
    </div>
  );
};