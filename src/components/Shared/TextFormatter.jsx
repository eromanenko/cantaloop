import React from 'react';

export const TextFormatter = ({ text, onCodeClick, activeTriggers = [], inventory = [], toggleCard }) => {
  if (!text) return null;

  /* 1. Conditional logic [If XX: ...] */
  const triggerLogicRegex = /\[(?:If|Якщо|Если)\s+([A-Z]\d)[:\s]+(.*?)(?:\.?\s*(?:Otherwise|Інакше|Иначе|В\s+противном\s+случае)[:\s]*)?\s*(.*?)\]/gi;
  let processedText = text.replace(triggerLogicRegex, (match, triggerId, ifText, otherwiseText) => {
    return activeTriggers.includes(triggerId.toUpperCase()) ? ifText : otherwiseText;
  });

  /* 2. Card logic (detection of #00 patterns) */
  const cardNumRegex = /#(\d{2})/g;
  const parts = processedText.split(/(\[.*?\])/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          const cardMatches = [...part.matchAll(cardNumRegex)];
          
          if (cardMatches.length > 0) {
            return (
              <span key={i} className="inline-block my-1.5 p-1.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] font-bold text-blue-800 shadow-sm">
                {part.split(cardNumRegex).map((subPart, j) => {
                  const isCardNum = /^\d{2}$/.test(subPart);
                  if (isCardNum) {
                    const hasCard = inventory.includes(subPart);
                    return (
                      <button 
                        key={j}
                        onClick={() => toggleCard(subPart)}
                        className={`mx-1 px-2.5 py-1 rounded-lg transition-all font-mono text-sm border shadow-sm ${
                          hasCard 
                            ? 'bg-blue-600 border-blue-700 text-white' 
                            : 'bg-white border-blue-200 text-blue-600 animate-pulse'
                        }`}
                      >
                        #{subPart}
                      </button>
                    );
                  }
                  return subPart;
                })}
              </span>
            );
          }
        }

        /* 3. Alphanumeric codes (a1b2) */
        const codeRegex = /([a-z]\d[a-z]\d)/gi;
        const codeParts = part.split(codeRegex);

        return codeParts.map((sub, k) => 
          codeRegex.test(sub) ? (
            <button 
              key={k} 
              onClick={() => onCodeClick(sub.toLowerCase())} 
              className="text-amber-800 underline font-black px-1 hover:text-amber-600 transition-colors font-mono"
            >
              {sub}
            </button>
          ) : sub
        );
      })}
    </span>
  );
};