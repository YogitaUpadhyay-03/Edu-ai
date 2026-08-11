import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, docTitle, onClose, onDelete }) {
  // Bind Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="w-[380px] bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl overflow-hidden dropdown-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2D31]">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-wider">Delete Document?</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-[#9A9BA1] hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs text-[#9A9BA1] leading-relaxed">
            Are you sure you want to permanently delete <span className="text-white font-medium">"{docTitle}"</span>? This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#9A9BA1] hover:text-white bg-[#1e2022] hover:bg-[#25282a] border border-[#2c2d31] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
