import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from './TransitionContext';

export default function NextPageButton({ nextRoute, disabled = false, className = '' }) {
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  const onClick = () => {
    if (disabled || !nextRoute) return;
    if (startTransition) {
      startTransition(() => navigate(nextRoute));
    } else {
      navigate(nextRoute);
    }
  };

  return (
    <div className={`w-full flex justify-center py-6 ${className}`}>
      {!disabled && nextRoute ? (
        <button
          onClick={onClick}
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
        >
          Next
        </button>
      ) : (
        <button disabled className="px-6 py-2 rounded-md bg-neutral-200 text-neutral-400 font-medium" aria-disabled>
          Next
        </button>
      )}
    </div>
  );
}
