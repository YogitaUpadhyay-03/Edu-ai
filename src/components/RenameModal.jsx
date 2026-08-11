import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function RenameModal({ isOpen, currentTitle, onClose, onRename }) {
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Sync title and autofocus input text
  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
      setError('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select(); // auto-select existing text
        }
      }, 50);
    }
  }, [isOpen, currentTitle]);

  // Bind Enter and Escape keys
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Document title cannot be empty.');
      return;
    }
    onRename(title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="w-[380px] bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl overflow-hidden dropdown-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2D31]">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Rename Document</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-[#9A9BA1] hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#9A9BA1] font-semibold uppercase tracking-wider">
              Document Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`w-full bg-[#1e2022] border ${
                error ? 'border-red-500/80 focus:border-red-500' : 'border-[#2C2D31] focus:border-[#3e4144]'
              } rounded-md px-3 py-2 text-xs text-white placeholder-[#9A9BA1] focus:outline-none transition-colors`}
            />
            {error && (
              <span className="text-[10px] text-red-400 font-medium mt-0.5">{error}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#9A9BA1] hover:text-white bg-[#1e2022] hover:bg-[#25282a] border border-[#2c2d31] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-[#111214] bg-[#F5F5F5] hover:bg-white rounded transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
