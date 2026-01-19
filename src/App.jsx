import React, { useState, useEffect } from 'react';
import { fetchAllGameData } from './services/api';
import { usePersistentState } from './hooks/usePersistentState';
import { DialogsTab } from './components/Tabs/DialogsTab';
import { CodesTab } from './components/Tabs/CodesTab';
import { HintsTab } from './components/Tabs/HintsTab';
import { TriggersTab } from './components/Tabs/TriggersTab';

export default function App() {
  const [lang, setLang] = usePersistentState('game_lang', 'UK');
  const [tab, setTab] = usePersistentState('active_tab', 'Dialogs');
  const [activeCode, setActiveCode] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  /* State for triggered flags, persisted in localStorage */
  const [activeTriggers, setActiveTriggers] = usePersistentState('active_triggers', []);

  useEffect(() => {
    const init = async () => {
      const cached = localStorage.getItem('cantaloop_full_data');
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }
      try {
        const freshData = await fetchAllGameData();
        setData(freshData);
        localStorage.setItem('cantaloop_full_data', JSON.stringify(freshData));
      } catch (err) {
        console.error("Data update failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLink = (code) => {
    setActiveCode(code);
    setTab('Codes');
  };

  const toggleTrigger = (id) => {
    setActiveTriggers(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  if (loading && !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-900 font-mono p-10 text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="tracking-widest animate-pulse font-bold text-sm">CANTALOOP_OS_LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex flex-col max-w-xl mx-auto">
          <div className="flex items-center justify-between p-3">
            <nav className="flex bg-slate-100 rounded-xl p-1 overflow-x-auto no-scrollbar">
              {['Dialogs', 'Codes', 'Hints', 'Triggers'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTab(t)} 
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                    tab === t ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
            
            <div className="flex gap-1 ml-2">
              {['UK', 'RU', 'EN'].map(l => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)} 
                  className={`w-8 h-8 flex items-center justify-center text-[10px] font-black rounded-lg border-2 transition-all ${
                    lang === l ? 'bg-blue-700 border-blue-800 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 animate-in fade-in duration-500">
        {tab === 'Dialogs' && (
          <DialogsTab 
            data={data} 
            lang={lang} 
            onCodeClick={handleLink} 
            activeTriggers={activeTriggers} 
          />
        )}
        {tab === 'Codes' && (
          <CodesTab 
            data={data} 
            lang={lang} 
            activeCode={activeCode} 
            setActiveCode={setActiveCode}
            activeTriggers={activeTriggers}
          />
        )}
        {tab === 'Hints' && <HintsTab data={data} lang={lang} />}
        {tab === 'Triggers' && (
          <TriggersTab 
            activeTriggers={activeTriggers} 
            onToggle={toggleTrigger} 
          />
        )}
      </main>
    </div>
  );
}