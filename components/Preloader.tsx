import React, { useEffect, useState } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => { setShouldRender(false); onComplete(); }, 700);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-700" style={{ opacity }}>
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-serif text-black font-bold tracking-[0.5em] mb-4">SOBERANO</h1>
        <p className="text-gold text-[10px] uppercase tracking-[0.3em]">Exclusividad & Elegancia</p>
      </div>
    </div>
  );
};

export default Preloader;