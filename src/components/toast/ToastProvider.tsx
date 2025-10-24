import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: string; title: string; description?: string };

type ToastContextType = {
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((cur) => [...cur, { ...t, id }]);
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[320px] text-black dark:text-white">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-md shadow-md border border-neutral-200 dark:border-neutral-800"
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && (
              <div className="text-sm text-muted-foreground">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within ToastProvider");
  return ctx;
};

export default ToastProvider;
