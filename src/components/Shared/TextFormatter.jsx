import React from 'react';

export const TextFormatter = ({ text, onCodeClick, activeTriggers = [], inventory = [], toggleCard, toggleTrigger }) => {
  if (!text) return null;

  /* 1. Process conditional logic [If ID: Text. Otherwise: Text] */
  const triggerLogicRegex = /\[(?:If|Якщо|Если)\s+([A-Z]\d)[:\s]+(.*?)(?:\.?\s*(?:Otherwise|Інакше|Иначе|В\s+противном\s+случае)[:\s]*)?\s*(.*?)\]/gi;
  
  let processedText = text.replace(triggerLogicRegex, (match, triggerId, ifText, otherwiseText) => {
    return activeTriggers.includes(triggerId.toUpperCase()) ? ifText : otherwiseText;
  });

  /* 2. Identify all interactive elements: 
     - Alphanumeric codes: (a1b2)
     - Trigger IDs: (A1)
     - Card numbers: (#01 or №01) <-- Added support for №
  */
  const combinedRegex = /([a-z]\d[a-z]\d|[A-Z]\d|[#№]\d{2})/g;
  const parts = processedText.split(combinedRegex);

  return (
    <span>
      {parts.map((part, i) => {
        // Alphanumeric code (e.g., g1p0)
        if (/^[a-z]\d[a-z]\d$/i.test(part)) {
          return (
            <button key={i} onClick={() => onCodeClick(part.toLowerCase())} className="text-amber-800 underline font-black px-1 hover:text-amber-600 transition-colors font-mono">
              {part}
            </button>
          );
        }
        
        // Trigger ID (e.g., D8, B2)
        if (/^[A-Z]\d$/.test(part)) {
          const isActive = activeTriggers.includes(part);
          return (
            <button 
              key={i} 
              onClick={() => toggleTrigger && toggleTrigger(part)} 
              className={`mx-1 px-1.5 py-0.5 rounded-md border font-black transition-all ${
                isActive ? 'bg-amber-600 border-amber-700 text-white shadow-sm' : 'bg-white border-amber-300 text-amber-700'
              }`}
            >
              {part}
            </button>
          );
        }

        // Card number (e.g., #21 or №21)
        if (/^[#№]\d{2}$/.test(part)) {
          /* Extract digits regardless of prefix used (# or №) */
          const cardNum = part.replace(/[#№]/, '');
          const hasCard = inventory.includes(cardNum);
          return (
            <button 
              key={i} 
              onClick={() => toggleCard && toggleCard(cardNum)} 
              className={`mx-1 px-2 py-0.5 rounded-lg border font-mono font-bold transition-all ${
                hasCard ? 'bg-blue-600 border-blue-700 text-white shadow-sm' : 'bg-white border-blue-300 text-blue-600 animate-pulse'
              }`}
            >
              {part}
            </button>
          );
        }

        return part;
      })}
    </span>
  );
};