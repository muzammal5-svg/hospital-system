'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => addToast(title, message, 'success'), [addToast]);
  const error = useCallback((title: string, message?: string) => addToast(title, message, 'error'), [addToast]);
  const info = useCallback((title: string, message?: string) => addToast(title, message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const icon = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />,
            error: <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />,
            info: <Info className="h-5 w-5 text-[#0B4F8A] flex-shrink-0" />,
          }[t.type];

          const bg = {
            success: 'border-emerald-200 bg-white text-emerald-950 shadow-emerald-500/10',
            error: 'border-rose-200 bg-white text-rose-950 shadow-rose-500/10',
            info: 'border-blue-200 bg-white text-blue-950 shadow-blue-500/10',
          }[t.type];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${bg}`}
              role="alert"
            >
              {icon}
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1B2733]">{t.title}</p>
                {t.message && <p className="mt-0.5 text-xs text-[#5B6B7B]">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#8A97A5] hover:text-[#1B2733] transition-colors p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return graceful fallback if not wrapped
    return {
      toast: (title: string, message?: string) => console.log(`[Toast] ${title}: ${message || ''}`),
      success: (title: string, message?: string) => console.log(`[Toast Success] ${title}: ${message || ''}`),
      error: (title: string, message?: string) => console.error(`[Toast Error] ${title}: ${message || ''}`),
      info: (title: string, message?: string) => console.info(`[Toast Info] ${title}: ${message || ''}`),
    };
  }
  return context;
}
