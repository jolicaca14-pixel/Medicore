import React from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
  };

  const Icon = variant === 'danger' ? AlertTriangle : (variant === 'success' ? CheckCircle : AlertTriangle);
  const iconColor = variant === 'danger' ? 'text-red-500' : (variant === 'success' ? 'text-green-500' : 'text-blue-500');

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-50' : (variant === 'success' ? 'bg-green-50' : 'bg-blue-50')}`}>
              <Icon className={iconColor} size={24} />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
