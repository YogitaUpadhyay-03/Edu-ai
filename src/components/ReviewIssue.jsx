import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ReviewIssue({ label, title, description, risk, isSelected, onClick }) {
  // Select color classes based on risk levels
  const leftBorderColor = risk === 'high' ? 'border-l-[#ef4444]' : 'border-l-[#f59e0b]';

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col border rounded-md p-3 pl-3.5 relative overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#25282a] border-[#3e4144] shadow-md scale-[1.01]'
          : 'bg-[#111214]/65 border-[#2C2D31] hover:bg-[#111214] hover:border-[#303136]'
      } border-l-2 ${leftBorderColor}`}
    >
      {/* Category header */}
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] uppercase tracking-wider text-[#9A9BA1] font-semibold">
          {label}
        </span>
        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
          isSelected ? 'text-white translate-x-0.5' : 'text-[#9A9BA1] opacity-70'
        }`} />
      </div>

      {/* Title */}
      <h3 className={`text-xs font-semibold mb-1 transition-colors ${
        isSelected ? 'text-white font-bold' : 'text-[#F5F5F5]'
      }`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-[11px] text-[#9A9BA1] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
