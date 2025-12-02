import React, { createContext, useState, useContext } from 'react';

const TransitionContext = createContext({
  startTransition: (fn) => fn && fn()
});

export function TransitionProvider({ children }) {
  const [animating, setAnimating] = useState(false);

  const startTransition = async (navFn, duration = 340) => {
    if (animating) return;
    setAnimating(true);
    
    await new Promise((r) => setTimeout(r, 180));
    
    try { if (typeof navFn === 'function') navFn(); } catch (err) {}
    
    await new Promise((r) => setTimeout(r, duration - 180));
    setAnimating(false);
  };

  return (
    <TransitionContext.Provider value={{ startTransition, animating }}>
      {children}
      {}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900/90`}
        style={{ mixBlendMode: 'normal' }}
      />
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);

export default TransitionContext;
