import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'primary' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, variant = 'primary' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-full ${
            variant === 'danger' ? 'bg-red-100 text-red-600' :
            variant === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {variant === 'danger' && <AlertTriangle size={24}/>}
            {variant === 'success' && <CheckCircle size={24}/>}
            {variant === 'primary' && <Info size={24}/>}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20}/></button>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg ${
            variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' :
            variant === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
          }`}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};
