import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '', size = 14 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'hover:bg-slate-100 text-slate-400 hover:text-blue-600'
      } ${className}`}
      title={copied ? "¡Copiado!" : "Copiar"}
      aria-label={copied ? "Copiado al portapapeles" : "Copiar al portapapeles"}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {copied && <span className="text-[10px] font-bold animate-in fade-in zoom-in duration-200">¡Copiado!</span>}
    </button>
  );
};
