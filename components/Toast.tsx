import React, { useEffect } from 'react';
import { CheckCircle, Heart, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'wishlist' | 'info';
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] animate-slide-up">
      <div className="bg-white border-l-4 border-navy shadow-xl px-6 py-4 flex items-center gap-4 min-w-[300px]">
        <div className="text-navy">
          {type === 'success' && <CheckCircle size={20} />}
          {type === 'wishlist' && <Heart size={20} fill="currentColor" />}
          {type === 'info' && <Info size={20} />}
        </div>
        <div className="flex-1">
          <p className="text-black text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={14} /></button>
      </div>
    </div>
  );
};

export default Toast;