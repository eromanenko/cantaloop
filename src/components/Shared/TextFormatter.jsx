import React from 'react';

export const TextFormatter = ({ text, onCodeClick }) => {
  if (!text) return null;
  
  const codeRegex = /([a-z]\d[a-z]\d)/gi;
  const parts = text.split(codeRegex);

  return (
    <span>
      {parts.map((part, i) => 
        codeRegex.test(part) ? (
          <button 
            key={i} 
            onClick={() => onCodeClick(part.toLowerCase())} 
            className="text-amber-400 underline font-bold px-1 hover:text-amber-300 transition-colors"
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