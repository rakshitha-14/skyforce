import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/90 border-emerald-800 text-emerald-400',
          icon: <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90 border-rose-800 text-rose-450',
          icon: <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 border-amber-800 text-amber-450',
          icon: <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-900/95 border-slate-800 text-slate-300',
          icon: <Info size={16} className="text-blue-500 flex-shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toasts container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-xs sm:max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyle(toast.type);
          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto animate-slide-in ${style.bg}`}
              style={{ animation: 'slideIn 0.25s ease-out' }}
            >
              <div className="flex gap-2.5 min-w-0">
                {style.icon}
                <p className="text-xs font-semibold leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-500 hover:text-slate-350 transition-colors p-0.5 rounded-lg focus:outline-none flex-shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Inject custom CSS keyframe animations directly */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
