import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bg = 'bg-slate-900 text-white border-slate-700';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bg = 'bg-rose-950 text-rose-50 border-rose-800';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          bg = 'bg-slate-900 text-white border-slate-700';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl transition-all duration-300 transform translate-y-0 ${bg}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-1 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
