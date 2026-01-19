import React from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { TextFormatter } from '../Shared/TextFormatter';

export const ScenesTab = ({ data, lang, t, onCodeClick, activeTriggers }) => {
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
      <div className="sticky top-0 z-10 bg-slate-50/95 py-2 backdrop-blur-sm">
        <select 
          value={sceneId} 
          onChange={e => setSceneId(e.target.value)}
          className="w-full bg-white p-3 rounded-xl border border-slate-300 text-slate-900 outline-none shadow-sm font-bold appearance-none transition-all focus:border-amber-500"
        >
          <option value="">{t('select_scene')}</option>
          {scenes.map(s => <option key={s.Id} value={s.Id}>{s[lang]}</option>)}
        </select>
      </div>

      {!sceneId ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 animate-in fade-in duration-700 px-10 text-center">
          <div className="w-16 h-16 mb-6 opacity-10">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">{t('empty_state_title')}</h3>
          <p className="text-xs italic mt-2 leading-relaxed">{t('empty_state_desc')}</p>
        </div>
      ) : (
        Object.entries(groups).map(([trigger, lines]) => {
          const isBase = trigger === 'base';
          const isTriggerActive = activeTriggers.includes(trigger);

          return (
            <div key={trigger} className="space-y-4">
              {!isBase && (
                <div className="flex justify-center my-6">
                  <details className="w-full group" open={isTriggerActive}>
                    <summary className={`list-none cursor-pointer p-2 rounded-lg transition-colors ${isTriggerActive ? 'bg-amber-100/30' : ''}`}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`h-px flex-grow ${isTriggerActive ? 'bg-amber-400' : 'bg-amber-200'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                          isTriggerActive ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isTriggerActive ? '✓' : ''} {t('if_trigger')} {trigger}
                        </span>
                        <div className={`h-px flex-grow ${isTriggerActive ? 'bg-amber-400' : 'bg-amber-200'}`}></div>
                      </div>
                    </summary>
                    <div className="mt-4 space-y-4 px-2">
                      {lines.map((l, i) => (
                        <ChatLine key={i} line={l} lang={lang} onCodeClick={onCodeClick} activeTriggers={activeTriggers} />
                      ))}
                    </div>
                  </details>
                </div>
              )}
              
              {isBase && lines.map((l, i) => (
                <ChatLine key={i} line={l} lang={lang} onCodeClick={onCodeClick} activeTriggers={activeTriggers} />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

const ChatLine = ({ line, lang, onCodeClick, activeTriggers }) => {
  const hasPerson = line.Person && line.Person.trim() !== "";
  
  if (!hasPerson) {
    return (
      <div className="narrative-text animate-in fade-in duration-700">
        <TextFormatter text={line[lang]} onCodeClick={onCodeClick} activeTriggers={activeTriggers} />
      </div>
    );
  }

  const isHook = line.Person.toLowerCase() === 'hook';
  const avatarPath = `/avatars/${line.Person.toLowerCase().trim()}.png`;

  return (
    <div className={`flex items-end space-x-2 mb-2 ${isHook ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shadow-sm">
        <img 
          src={avatarPath} alt="" 
          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?background=cbd5e1&color=64748b&name=' + line.Person; }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`flex flex-col ${isHook ? 'items-end' : 'items-start'}`}>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1 px-1 italic">
          {line.Person}
        </span>
        <div className={`chat-bubble ${isHook ? 'bubble-hook' : 'bubble-other'} animate-in slide-in-from-bottom-1 duration-300`}>
          <TextFormatter text={line[lang]} onCodeClick={onCodeClick} activeTriggers={activeTriggers} />
        </div>
      </div>
    </div>
  );
};