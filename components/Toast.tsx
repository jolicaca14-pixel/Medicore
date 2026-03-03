import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
    warning: <AlertTriangle className="text-yellow-500" size={18} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`flex items-center p-4 mb-2 border rounded-lg shadow-lg animate-in fade-in slide-in-from-right-5 duration-300 ${bgColors[type]}`}>
      <div className="mr-3">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
