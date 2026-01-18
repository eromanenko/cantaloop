import React, { useState, useEffect } from 'react';
import { fetchAllGameData } from './services/api';
import { usePersistentState } from './hooks/usePersistentState';
import { DialogsTab } from './components/Tabs/DialogsTab';
import { CodesTab } from './components/Tabs/CodesTab';
import { HintsTab } from './components/Tabs/HintsTab';

export default function App() {
  const [lang, setLang] = usePersistentState('game_lang', 'UK');
  const [tab, setTab] = usePersistentState('active_tab', 'Dialogs');
  const [activeCode, setActiveCode] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Спочатку пробуємо взяти з кешу
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
        console.error("Помилка оновлення даних:", err);
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

  if (loading && !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-amber-500 font-mono p-10 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="tracking-widest animate-pulse">CANTALOOP_OS_LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="flex items-center justify-between p-3 max-w-xl mx-auto">
          <nav className="flex bg-slate-800/50 rounded-xl p-1 shadow-inner">
            {['Dialogs', 'Codes', 'Hints'].map(t => (
              <button 
                key={t} 
                onClick={() => setTab(t)} 
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  tab === t ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          
          <div className="flex gap-1.5">
            {['UK', 'RU', 'EN'].map(l => (
              <button 
                key={l} 
                onClick={() => setLang(l)} 
                className={`w-9 h-9 flex items-center justify-center text-[10px] font-black rounded-xl border-2 transition-all ${
                  lang === l ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-800 text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-4 animate-in fade-in duration-500">
        {tab === 'Dialogs' && <DialogsTab data={data} lang={lang} onCodeClick={handleLink} />}
        {tab === 'Codes' && (
          <CodesTab 
            data={data} 
            lang={lang} 
            activeCode={activeCode} 
            setActiveCode={setActiveCode} 
          />
        )}
        {tab === 'Hints' && <HintsTab data={data} lang={lang} />}
      </main>
    </div>
  );
}