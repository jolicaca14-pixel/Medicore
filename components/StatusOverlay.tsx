import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface StatusOverlayProps {
    message: { text: string, type: 'success' | 'error' | 'info' } | null;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-2xl flex items-center border-l-4 animate-in slide-in-from-right-10 ${
            message.type === 'success' ? 'bg-white border-l-green-500 text-green-800' :
            message.type === 'error' ? 'bg-white border-l-red-500 text-red-800' : 'bg-white border-l-blue-500 text-blue-800'
        }`}>
            {message.type === 'success' ? <CheckCircle size={20} className="mr-3 text-green-500"/> :
             message.type === 'error' ? <AlertCircle size={20} className="mr-3 text-red-500"/> :
             <Info size={20} className="mr-3 text-blue-500"/>}
            <span className="font-bold text-sm">{message.text}</span>
        </div>
    );
};
