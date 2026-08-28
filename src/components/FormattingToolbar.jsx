import React, { useState, useEffect } from 'react';
import { ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, MessageSquarePlus, Highlighter } from 'lucide-react';

export default function FormattingToolbar({ activeDropdown, onToggleDropdown, editorRef, onFormat }) {
  const [textStyle, setTextStyle] = useState('Normal Text');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [align, setAlign] = useState('left');

  const isTextStyleOpen = activeDropdown === 'normal-text';
  const isHighlightOpen = activeDropdown === 'highlight-color';

  // Selection change listener to track text styling in the editor
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);

      // Only read formatting state if the selection is inside the editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));

        if (document.queryCommandState('justifyCenter')) {
          setAlign('center');
        } else {
          setAlign('left');
        }

        // Find text block type (Heading 1, Heading 2, Normal Text)
        let node = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }
        let blockStyle = 'Normal Text';
        while (node && node !== editorRef.current) {
          const tag = node.tagName?.toLowerCase();
          if (tag === 'h1') {
            blockStyle = 'Heading 1';
            break;
          }
          if (tag === 'h2') {
            blockStyle = 'Heading 2';
            break;
          }
          if (tag === 'p') {
            blockStyle = 'Normal Text';
            break;
          }
          node = node.parentNode;
        }
        setTextStyle(blockStyle);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [editorRef]);

  const handleStyleSelect = (style) => {
    setTextStyle(style);
    onToggleDropdown(null);
    if (style === 'Heading 1') {
      onFormat('formatBlock', '<h1>');
    } else if (style === 'Heading 2') {
      onFormat('formatBlock', '<h2>');
    } else {
      onFormat('formatBlock', '<p>');
    }
  };

  const handleHighlightSelect = (color) => {
    onFormat('hiliteColor', color);
    onToggleDropdown(null);
  };

  return (
    <div className="flex items-center bg-[#1e2022] border border-[#2c2d31] rounded-full px-3 py-1.5 shadow-lg select-none gap-2 relative">
      {/* Dropdown container */}
      <div className="relative dropdown-trigger">
        <button 
          id="btn-toolbar-text-style"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('bold')}
          className={`p-1 rounded transition-colors ${
            isBold ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-italic"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('italic')}
          className={`p-1 rounded transition-colors ${
            isItalic ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-underline"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('underline')}
          className={`p-1 rounded transition-colors ${
            isUnderline ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        {/* Highlight Color dropdown container */}
        <div className="relative dropdown-trigger">
          <button 
            id="btn-toolbar-highlight"
            type="button" 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onToggleDropdown(isHighlightOpen ? null : 'highlight-color')}
            className={`p-1 rounded transition-colors ${
              isHighlightOpen ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          
          {isHighlightOpen && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 p-2 bg-[#17191A] border border-[#2C2D31] rounded-lg shadow-2xl z-50 flex flex-col gap-1.5 w-[140px] dropdown-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[9px] uppercase tracking-wider text-[#9A9BA1] font-bold px-1 mb-0.5 text-left select-none">Highlight Color</div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: 'Purple', value: '#E9D5FF' },
                  { name: 'Yellow', value: '#FEF3A5' },
                  { name: 'Green', value: '#DCFCE7' },
                  { name: 'Blue', value: '#DBEAFE' },
                  { name: 'Pink', value: '#FCE7F3' },
                  { name: 'Orange', value: '#FED7AA' }
                ].map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleHighlightSelect(color.value)}
                    className="w-7 h-7 rounded border border-white/10 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
              <div className="h-[1px] bg-[#2c2d31] my-0.5" />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleHighlightSelect('transparent')}
                className="text-[10px] text-[#9A9BA1] hover:text-white hover:bg-[#25282a] py-1 rounded text-center transition-colors cursor-pointer"
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-3.5 bg-[#2c2d31]" />

      {/* Alignment and Comment buttons */}
      <div className="flex items-center gap-1">
        <button 
          id="btn-toolbar-align-left"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('justifyLeft')}
          className={`p-1 rounded transition-colors ${
            align === 'left' ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-align-center"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('justifyCenter')}
          className={`p-1 rounded transition-colors ${
            align === 'center' ? 'text-white bg-[#25282a]' : 'text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a]'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button 
          id="btn-toolbar-comment"
          type="button" 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('comment')}
          className="p-1 text-[#9A9BA1] hover:text-[#F5F5F5] hover:bg-[#25282a] rounded transition-colors"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
