import React from 'react';

export const TextFormatter = ({ text, onCodeClick }) => {
  if (!text) return null;
  
  /* Regular expression to catch codes like a1b2, A1B2 */
  const codeRegex = /([a-z]\d[a-z]\d)/gi;
  const parts = text.split(codeRegex);

  return (
    <span>
      {parts.map((part, i) => 
        codeRegex.test(part) ? (
          <button 
            key={i} 
            onClick={() => onCodeClick(part.toLowerCase())} 
            /* Using darker amber for better contrast on white background */
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