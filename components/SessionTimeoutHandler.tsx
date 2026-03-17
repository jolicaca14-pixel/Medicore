import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Clock, LogOut } from 'lucide-react';

interface SessionTimeoutHandlerProps {
  onLogout: () => void;
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const SessionTimeoutHandler: React.FC<SessionTimeoutHandlerProps> = ({
  onLogout,
  timeoutMinutes = 15,
  warningMinutes = 1
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(warningMinutes * 60);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setRemainingSeconds(warningMinutes * 60);
  }, [warningMinutes]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;

    const startTimers = () => {
      // Set absolute timeout for logout
      timeoutId = setTimeout(() => {
        onLogout();
      }, timeoutMinutes * 60 * 1000);

      // Set timeout to show warning
      warningId = setTimeout(() => {
        setShowWarning(true);
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);
    };

    const activityHandler = () => {
      if (!showWarning) {
        clearTimeout(timeoutId);
        clearTimeout(warningId);
        startTimers();
      }
    };

    // Events to monitor activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, activityHandler));

    startTimers();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      events.forEach(event => window.removeEventListener(event, activityHandler));
    };
  }, [onLogout, timeoutMinutes, warningMinutes, showWarning]);

  // Countdown logic when warning is shown
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (showWarning && remainingSeconds > 0) {
      intervalId = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0) {
      onLogout();
    }
    return () => clearInterval(intervalId);
  }, [showWarning, remainingSeconds, onLogout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Inactividad Detectada</h3>
        <p className="text-slate-500 mb-6">
          Su sesión expirará automáticamente en <span className="font-bold text-orange-600">{remainingSeconds} segundos</span> debido a inactividad por seguridad de los datos.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={resetTimer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all"
          >
            Continuar Trabajando
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-slate-500 hover:text-red-600 font-medium py-2 transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
