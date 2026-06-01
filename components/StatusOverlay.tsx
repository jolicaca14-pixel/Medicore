import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'info';

interface StatusOverlayProps {
  message: string;
  type: StatusType;
  onClose: () => void;
  duration?: number;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="text-green-500" size={20} />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="text-red-500" size={20} />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <AlertCircle className="text-blue-500" size={20} />
    }
  };

  const { bg, border, text, icon } = config[type];

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-4 duration-300">
      <div className={`${bg} ${border} ${text} border p-4 rounded-xl shadow-lg flex items-center min-w-[300px] max-w-md`}>
        <div className="mr-3">{icon}</div>
        <div className="flex-1 font-medium text-sm">{message}</div>
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
