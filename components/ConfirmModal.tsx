import React from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'DANGER' | 'PRIMARY' | 'SUCCESS';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'PRIMARY'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-4 border-b flex items-center ${
            variant === 'DANGER' ? 'bg-red-50 text-red-800 border-red-100' :
            variant === 'SUCCESS' ? 'bg-green-50 text-green-800 border-green-100' :
            'bg-blue-50 text-blue-800 border-blue-100'
        }`}>
          {variant === 'DANGER' && <AlertTriangle className="mr-3 text-red-600" size={20}/>}
          {variant === 'SUCCESS' && <CheckCircle className="mr-3 text-green-600" size={20}/>}
          {variant === 'PRIMARY' && <Info className="mr-3 text-blue-600" size={20}/>}
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5 ${
              variant === 'DANGER' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
              variant === 'SUCCESS' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
