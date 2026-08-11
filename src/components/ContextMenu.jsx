import React, { useEffect, useRef } from 'react';
import { Type, Archive, Trash2, ArrowUpCircle } from 'lucide-react';

export default function ContextMenu({ 
  x, 
  y, 
  docId, 
  isArchived, 
  onClose, 
  onRename, 
  onArchive, 
  onRestore, 
  onDelete 
}) {
  const menuRef = useRef(null);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Dimensions of the context menu
  const menuWidth = 155;
  const menuHeight = isArchived ? 78 : 110;

  // Correct position if it overflows viewport
  let adjustedX = x;
  let adjustedY = y;

  if (x + menuWidth > window.innerWidth) {
    adjustedX = window.innerWidth - menuWidth - 12;
  }
  if (y + menuHeight > window.innerHeight) {
    adjustedY = window.innerHeight - menuHeight - 12;
  }

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-[#17191A] border border-[#2C2D31] rounded-lg py-1 shadow-2xl flex flex-col w-[150px] text-left dropdown-content animate-fade-in"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {!isArchived ? (
        <>
          {/* Rename Option */}
          <button
            type="button"
            onClick={() => {
              onRename();
              onClose();
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] transition-colors"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Rename</span>
          </button>

          {/* Archive Option */}
          <button
            type="button"
            onClick={() => {
              onArchive();
              onClose();
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </>
      ) : (
        /* Restore Option */
        <button
          type="button"
          onClick={() => {
            onRestore();
            onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022] transition-colors"
        >
          <ArrowUpCircle className="w-3.5 h-3.5" />
          <span>Restore</span>
        </button>
      )}

      {/* Divider */}
      <div className="h-[1px] bg-[#2C2D31] my-0.5" />

      {/* Delete Option */}
      <button
        type="button"
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
}
