import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface StatusMessage {
    text: string;
    type: 'SUCCESS' | 'ERROR' | 'INFO';
}

interface StatusOverlayProps {
    message: StatusMessage | null;
    onClose: () => void;
    duration?: number;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [message, onClose, duration]);

    if (!message) return null;

    const bgClass = message.type === 'SUCCESS' ? 'bg-green-600' : (message.type === 'ERROR' ? 'bg-red-600' : 'bg-blue-600');

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-right-4 duration-300">
            <div className={`${bgClass} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center min-w-[300px]`}>
                {message.type === 'SUCCESS' ? <CheckCircle className="mr-3" size={24}/> : <AlertCircle className="mr-3" size={24}/>}
                <div className="flex-1">
                    <p className="font-bold text-sm">{message.text}</p>
                </div>
                <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={18}/>
                </button>
            </div>
        </div>
    );
};
