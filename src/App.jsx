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
  const [loadProgress, setLoadProgress] = useState(0); // Progress percentage
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
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }
      try {
        const freshData = await fetchAllGameData((p) => setLoadProgress(p));
        setData(freshData);
        localStorage.setItem('cantaloop_full_data', JSON.stringify(freshData));
      } catch (err) {
        console.error("Update failed:", err);
      } finally {
        setLoading(false);
      }
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

  /* Destructive action: wipes all saved data and reloads app */
  const handleReset = () => {
    if (window.confirm(t('reset_confirm'))) {
      localStorage.removeItem('active_triggers');
      localStorage.removeItem('game_inventory');
      localStorage.removeItem('active_tab');
      window.location.reload();
    }
  };

  if (loading && !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-10">
        <div className="w-full max-w-xs space-y-4">
          <div className="text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 animate-pulse">
            LOADING_OS_{loadProgress}%
          </div>
          {/* Progress bar container */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'Scenes', label: t('tab_scenes') },
    { id: 'Codes', label: t('tab_codes') },
    { id: 'Hints', label: t('tab_hints') }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-3 max-w-xl mx-auto">
          <nav className="flex bg-slate-100 rounded-xl p-1">
            {tabs.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${tab === item.id ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600 active:scale-90 transition-transform shadow-sm"
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
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">✕</button>
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

              {/* State Tabs */}
              <div className="space-y-2">
                {['Inventory', 'Triggers'].map(id => (
                  <button
                    key={id}
                    onClick={() => { setTab(id); setIsMenuOpen(false); }}
                    className={`w-full p-4 rounded-xl flex items-center justify-between font-bold transition-all ${tab === id ? 'bg-amber-50 text-amber-700 border-2 border-amber-200' : 'bg-slate-50 text-slate-600 border-2 border-transparent'
                      }`}
                  >
                    <span>{t(`tab_${id.toLowerCase()}`)}</span>
                    <span className="text-[10px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-black">
                      {id === 'Inventory' ? inventory.length : activeTriggers.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Reset Section */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="w-full p-4 rounded-xl flex items-center gap-3 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('reset_all')}
                </button>
              </div>
            </div>

            <div className="p-6 text-[10px] text-slate-300 text-center uppercase font-black tracking-widest">
              Cantaloop OS v1.0.6
            </div>
          </aside>
        </div>
      )}

      <main className="max-w-xl mx-auto p-4">
        {tab === 'Scenes' && <ScenesTab data={data} lang={lang} t={t} onCodeClick={handleLink} activeTriggers={activeTriggers} inventory={inventory} toggleCard={toggleCard} toggleTrigger={toggleTrigger} />}
        {tab === 'Codes' && <CodesTab data={data} lang={lang} t={t} activeCode={activeCode} setActiveCode={setActiveCode} activeTriggers={activeTriggers} inventory={inventory} toggleCard={toggleCard} toggleTrigger={toggleTrigger} />}
        {tab === 'Hints' && <HintsTab data={data} lang={lang} toggleTrigger={toggleTrigger} t={t} />}
        {tab === 'Triggers' && <TriggersTab activeTriggers={activeTriggers} onToggle={toggleTrigger} t={t} />}
        {tab === 'Inventory' && <InventoryTab inventory={inventory} onToggle={toggleCard} t={t} />}
      </main>
    </div>
  );
}