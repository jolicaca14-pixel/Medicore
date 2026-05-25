import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type StatusMessageType = 'SUCCESS' | 'ERROR' | 'INFO';

export interface StatusMessage {
  text: string;
  type: StatusMessageType;
}

interface StatusOverlayProps {
  message: StatusMessage | null;
  onClose: () => void;
  duration?: number;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message && !isVisible) return null;

  const config = {
    SUCCESS: { icon: <CheckCircle className="text-green-500" size={24} />, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    ERROR: { icon: <AlertCircle className="text-red-500" size={24} />, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    INFO: { icon: <Info className="text-blue-500" size={24} />, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' }
  }[message?.type || 'INFO'];

  return (
    <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
      <div className={`${config.bg} ${config.border} border shadow-lg rounded-xl p-4 flex items-center min-w-[300px] max-w-md`}>
        <div className="mr-3">{config.icon}</div>
        <div className={`flex-1 font-bold text-sm ${config.text}`}>
          {message?.text}
        </div>
        <button onClick={() => setIsVisible(false)} className="ml-3 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
