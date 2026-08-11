import React, { useState } from 'react';
import { ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, MessageSquarePlus } from 'lucide-react';

export default function FormattingToolbar({ onShowToast, activeDropdown, onToggleDropdown }) {
  const [textStyle, setTextStyle] = useState('Normal Text');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [align, setAlign] = useState('left');

  const isTextStyleOpen = activeDropdown === 'normal-text';

  const handleStyleSelect = (style) => {
    setTextStyle(style);
    onToggleDropdown(null);
    onShowToast(`Applied text style: ${style}`);
  };

  return (
    <div className="flex items-center bg-[#1e2022] border border-[#2c2d31] rounded-full px-3 py-1.5 shadow-lg select-none gap-2 relative">
      {/* Dropdown container */}
      <div className="relative dropdown-trigger">
        <button 
          id="btn-toolbar-text-style"
          type="button" 
          onClick={() => onToggleDropdown(isTextStyleOpen ? null : 'normal-text')}
          className="flex items-center gap-1 text-[11px] text-[#9A9BA1] hover:text-[#F5F5F5] font-medium px-2 py-0.5 rounded hover:bg-[#25282a] transition-colors"
        >
          <span>{textStyle}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {isTextStyleOpen && (
          <div 
            className="absolute left-0 top-full mt-1.5 w-[110px] bg-[#17191A] border border-[#2C2D31] rounded-lg p-1 shadow-2xl z-40 flex flex-col dropdown-content text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {['Normal Text', 'Heading 1', 'Heading 2'].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleSelect(style)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-colors ${
                  textStyle === style 
                    ? 'text-white bg-[#25282a]' 
                    : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#1e2022]'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-[1px] h-3.5 bg-[#2c2d31]" />

      {/* Formatting buttons */}
      <div className="flex items-center gap-1">
        <button 
          id="btn-toolbar-bold"
          type="button" 
          onClick={() => setIsBold(!isBold)}
          className={`p-1 rounded transition-colors ${
            isBold ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-italic"
          type="button" 
          onClick={() => setIsItalic(!isItalic)}
          className={`p-1 rounded transition-colors ${
            isItalic ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-underline"
          type="button" 
          onClick={() => setIsUnderline(!isUnderline)}
          className={`p-1 rounded transition-colors ${
            isUnderline ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-3.5 bg-[#2c2d31]" />

      {/* Alignment and Comment buttons */}
      <div className="flex items-center gap-1">
        <button 
          id="btn-toolbar-align-left"
          type="button" 
          onClick={() => setAlign('left')}
          className={`p-1 rounded transition-colors ${
            align === 'left' ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-align-center"
          type="button" 
          onClick={() => setAlign('center')}
          className={`p-1 rounded transition-colors ${
            align === 'center' ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-comment"
          type="button" 
          onClick={() => onShowToast('Comment mode enabled')}
          className="p-1 text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a] rounded transition-colors"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
