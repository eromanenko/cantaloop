import React, { useState, useEffect } from 'react';
import { fetchAllGameData } from './services/api';
import { usePersistentState } from './hooks/usePersistentState';
import { ScenesTab } from './components/Tabs/ScenesTab';
import { CodesTab } from './components/Tabs/CodesTab';
import { HintsTab } from './components/Tabs/HintsTab';
import { TriggersTab } from './components/Tabs/TriggersTab';
import { InventoryTab } from './components/Tabs/InventoryTab';

export default function App() {
  const [lang, setLang] = usePersistentState('game_lang', 'UK');
  const [tab, setTab] = usePersistentState('active_tab', 'Scenes');
  const [activeCode, setActiveCode] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [activeTriggers, setActiveTriggers] = usePersistentState('active_triggers', []);
  const [inventory, setInventory] = usePersistentState('game_inventory', []);

  const t = (id) => {
    if (!data) return id;
    const item = data.dict.find(i => i.Table === 'ui' && i.Id === id);
    return item ? item[lang] : id;
  };

  useEffect(() => {
    const init = async () => {
      const cached = localStorage.getItem('cantaloop_full_data');
      if (cached) { setData(JSON.parse(cached)); setLoading(false); }
      try {
        const freshData = await fetchAllGameData();
        setData(freshData);
        localStorage.setItem('cantaloop_full_data', JSON.stringify(freshData));
      } catch (err) { console.error("Update failed:", err); }
      setLoading(false);
    };
    init();
  }, []);

  const handleLink = (code) => { setActiveCode(code); setTab('Codes'); };
  const toggleTrigger = (id) => {
    setActiveTriggers(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };
  const toggleCard = (num) => {
    setInventory(prev => prev.includes(num) ? prev.filter(c => c !== num) : [...prev, num]);
  };

  if (loading && !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-mono text-amber-600 animate-pulse">
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-3 max-w-xl mx-auto">
          <nav className="flex bg-slate-100 rounded-xl p-1">
            {['Scenes', 'Codes', 'Hints'].map(id => (
              <button 
                key={id} 
                onClick={() => setTab(id)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  tab === id ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500'
                }`}
              >
                {t(`tab_${id.toLowerCase()}`)}
              </button>
            ))}
          </nav>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600 active:scale-90 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* SIDEBAR (Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <aside className="relative w-80 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-black uppercase tracking-widest text-xs text-slate-400">{t('menu_title')}</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">✕</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-8">
              {/* Language Switcher */}
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-3 tracking-widest">Language</span>
                <div className="flex gap-2">
                  {['UK', 'RU', 'EN'].map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`flex-grow py-3 rounded-xl font-black border-2 transition-all ${lang === l ? 'bg-blue-600 border-blue-700 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Quick Tabs in Menu */}
              <div className="space-y-2">
                {['Inventory', 'Triggers'].map(id => (
                  <button 
                    key={id} 
                    onClick={() => { setTab(id); setIsMenuOpen(false); }}
                    className={`w-full p-4 rounded-xl flex items-center justify-between font-bold transition-all ${
                      tab === id ? 'bg-amber-50 text-amber-700 border-2 border-amber-200' : 'bg-slate-50 text-slate-600 border-2 border-transparent'
                    }`}
                  >
                    <span>{t(`tab_${id.toLowerCase()}`)}</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      {id === 'Inventory' ? inventory.length : activeTriggers.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 text-[10px] text-slate-300 text-center uppercase font-bold tracking-tighter">
              Cantaloop OS v1.0.4
            </div>
          </aside>
        </div>
      )}

      {/* CONTENT */}
      <main className="max-w-xl mx-auto p-4">
        {tab === 'Scenes' && <ScenesTab data={data} lang={lang} t={t} onCodeClick={handleLink} activeTriggers={activeTriggers} inventory={inventory} toggleCard={toggleCard} />}
        {tab === 'Codes' && <CodesTab data={data} lang={lang} t={t} activeCode={activeCode} setActiveCode={setActiveCode} activeTriggers={activeTriggers} inventory={inventory} toggleCard={toggleCard} />}
        {tab === 'Hints' && <HintsTab data={data} lang={lang} t={t} />}
        {tab === 'Triggers' && <TriggersTab activeTriggers={activeTriggers} onToggle={toggleTrigger} t={t} />}
        {tab === 'Inventory' && <InventoryTab inventory={inventory} onToggle={toggleCard} t={t} />}
      </main>
    </div>
  );
}