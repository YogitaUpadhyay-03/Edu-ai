import React, { useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-[#17191A] border border-[#2C2D31] text-[#F5F5F5] px-4 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-slide select-none">
      <Info className="w-4 h-4 text-purple-400" />
      <span className="text-xs font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-[#9A9BA1] hover:text-white p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
