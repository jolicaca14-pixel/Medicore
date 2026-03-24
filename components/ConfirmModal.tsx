import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

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
  variant = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {variant === 'danger' && <AlertTriangle className="text-red-500 mr-2" size={24} />}
            {variant === 'success' && <CheckCircle className="text-green-500 mr-2" size={24} />}
            {variant === 'primary' && <Info className="text-blue-500 mr-2" size={24} />}
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <X size={20} />
          </button>
        </div>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg font-bold text-sm transition-all shadow-md ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' :
              variant === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
