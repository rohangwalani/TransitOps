import React from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTransitOps();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        let bgClass = 'bg-secondary text-white';
        let icon = 'check_circle';
        if (isError) {
          bgClass = 'bg-error text-on-error';
          icon = 'error';
        } else if (isWarning) {
          bgClass = 'bg-tertiary text-on-tertiary';
          icon = 'warning';
        } else if (isInfo) {
          bgClass = 'bg-primary text-on-primary';
          icon = 'info';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg border border-white/10 pointer-events-auto transform transition-all duration-300 animate-slide-in ${bgClass}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined select-none text-[20px]">{icon}</span>
              <p className="font-body-md text-body-md font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[16px] select-none">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
