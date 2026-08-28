import React from 'react';
import { FileText, FileSpreadsheet, FileCode, MessageSquare } from 'lucide-react';

export default function ExportMenu({ onClose, onShowToast }) {
  const options = [
    { label: 'Export as PDF', action: 'PDF export started', icon: FileText },
    { label: 'Export as DOCX (Clean)', action: 'DOCX export started', icon: FileSpreadsheet },
    { label: 'Export with AI Comments', action: 'Export with AI comments started', icon: MessageSquare },
    { label: 'Export Review Report', action: 'Review report export started', icon: FileCode },
  ];

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-[200px] bg-[#17191A] border border-[#2C2D31] rounded-lg p-1.5 shadow-2xl z-40 flex flex-col dropdown-content text-left"
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              onShowToast(opt.action);
              onClose();
            }}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded hover:bg-[#1e2022] text-xs text-[#9A9BA1] hover:text-[#F5F5F5] transition-colors duration-150"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
