import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'info';

interface StatusOverlayProps {
  message: string;
  type: StatusType;
  onClose: () => void;
  duration?: number;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  const Icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  };

  const Icon = Icons[type];

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4 min-w-[300px]`}>
        <div className="bg-white/20 p-2 rounded-full">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
