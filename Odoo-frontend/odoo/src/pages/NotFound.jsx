import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-md text-center max-w-md w-full">
        <span className="material-symbols-outlined text-display-lg text-primary mb-4 select-none">
          error
        </span>
        <h2 className="font-headline-md text-headline-md mb-2 font-bold">404 - Page Not Found</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          The dashboard section you are looking for does not exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-unit-lg py-3 rounded-lg bg-primary text-white font-bold hover:opacity-90 active:scale-95 transition-all shadow-md w-full"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
