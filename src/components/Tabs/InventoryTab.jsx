import React from 'react';

export const InventoryTab = ({ inventory, onToggle, t }) => {
  /* Generating card numbers 01 to 99 */
  const cardNumbers = Array.from({ length: 99 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center mb-6">
        <h2 className="font-black uppercase tracking-widest text-slate-400 text-[10px]">
          {t('inventory_title')}
        </h2>
        <div className="h-1 w-8 bg-blue-500 rounded-full mt-1"></div>
      </div>
      
      <div className="grid grid-cols-4 gap-2.5">
        {cardNumbers.map(num => {
          const isActive = inventory.includes(num);
          return (
            <button
              key={num}
              onClick={() => onToggle(num)}
              className={`relative py-3 rounded-xl border-2 font-mono font-bold text-sm transition-all active:scale-90 ${
                isActive 
                  ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                  : 'bg-white border-slate-100 text-slate-300'
              }`}
            >
              <span className="opacity-50 text-[10px] mr-0.5">#</span>
              {num}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
        <p className="text-[10px] text-slate-500 text-center italic leading-relaxed">
          {t('inventory_note')}
        </p>
      </div>
    </div>
  );
};