import React from 'react';

export const TextFormatter = ({ text, onCodeClick, activeTriggers = [] }) => {
  if (!text) return null;

  /* Multilingual Regex for [If ID: Text. Otherwise: Text] 
     Supports: If/Якщо/Если and Otherwise/Інакше/Иначе/В противном случае */
  const triggerLogicRegex = /\[(?:If|Якщо|Если)\s+([A-Z]\d)[:\s]+(.*?)(?:\.?\s*(?:Otherwise|Інакше|Иначе|В\s+противном\s+случае)[:\s]*)?\s*(.*?)\]/gi;

  let processedText = text.replace(triggerLogicRegex, (match, triggerId, ifText, otherwiseText) => {
    /* Check if triggerId (e.g. A8) exists in the activeTriggers array */
    const isTriggered = activeTriggers.includes(triggerId.toUpperCase());
    return isTriggered ? ifText : otherwiseText;
  });

  /* Regex for alphanumeric codes like a1b2 */
  const codeRegex = /([a-z]\d[a-z]\d)/gi;
  const parts = processedText.split(codeRegex);

  return (
    <span>
      {parts.map((part, i) => 
        codeRegex.test(part) ? (
          <button 
            key={i} 
            onClick={() => onCodeClick(part.toLowerCase())} 
            className="text-amber-800 underline font-black px-1 hover:text-amber-600 transition-colors"
          >
            {part}
          </button>
        ) : (
          part
        )
      )}
    </span>
  );
};