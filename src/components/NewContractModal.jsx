import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function NewContractModal({ isOpen, onClose, onCreateContract }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Reset and focus when opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a contract title.');
      return;
    }
    onCreateContract(title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="w-[420px] bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl overflow-hidden dropdown-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2D31]">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Create New Contract</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-[#9A9BA1] hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#9A9BA1] font-semibold uppercase tracking-wider">
              Contract Title
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter name..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`w-full bg-[#1e2022] border ${
                error ? 'border-red-500/80 focus:border-red-500' : 'border-[#2C2D31] focus:border-[#3e4144]'
              } rounded-md px-3 py-2 text-xs text-white placeholder-[#9A9BA1] focus:outline-none transition-colors`}
            />
            {error ? (
              <span className="text-[10px] text-red-400 font-medium mt-0.5">{error}</span>
            ) : (
              <span className="text-[10px] text-[#9A9BA1]">
                A new document canvas will be initialized with this title.
              </span>
            )}
          </div>

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
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-[#111214] bg-[#F5F5F5] hover:bg-white rounded transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
